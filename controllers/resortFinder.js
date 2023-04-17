const User = require("../models/user");
const PassInfo = require("../models/passInfo");
const keys = require("../config/dev");
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require("axios");
const ResortInfo = require("../models/resortInfo");

exports.resortFinder = async (req, res, next) => {
  console.log(`resortFinder is invoked!`);
  const client = new Client({});
  const location = { latitude: "", longitude: "" };
  const matchingPassIds = [];
  const userSearchResultPlaceIds = [];
  const userPassIds = [];
  // make initial request for user selected location coordinates
  try {
    const response4UserSelection = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.city},+${req.body.state}&key=${keys.GOOGLE_API_KEY}`
    );
    location.latitude =
      response4UserSelection.data.results[0].geometry.location.lat;
    location.longitude =
      response4UserSelection.data.results[0].geometry.location.lng;
  } catch (err) {
    console.log(err);
  }
  // make a request for ski resorts near user selected town and radius; save place_id's in an array userSearchResultPlaceIds.
  const request = {
    params: {
      location,
      radius: req.body.radius,
      keyword: "ski resort",
      key: keys.GOOGLE_API_KEY,
      type: [
        "tourist_attraction",
        "lodging",
        "point_of_interest",
        "establishment",
        "natural_feature",
      ],
    },
  };
  try {
    const userSearchResults = await client.placesNearby(request);
    // console.log(userSearchResults);
    userSearchResults.data.results.forEach((skiResort) => {
      userSearchResultPlaceIds.push({ place_id: skiResort.place_id });
    });
  } catch (err) {
    console.log(err);
  }
  // if user provides passName info - retreive ids of ski resorts available to user with their pass and run findMatchingPassIds
  if (req.body.passName) {
    try {
      console.log(`req.body.passName is: ${req.body.passName}`);
      const pass = await PassInfo.findOne({ passName: req.body.passName })
        .populate({
          path: "resortAccessList",
          select: "place_id",
        })
        .exec();
      pass.resortAccessList.forEach((resort) => {
        console.log(`db search with passName provided place ids below:`);
        console.log(resort.place_id);
        userPassIds.push({ place_id: resort.place_id });
      });
      await findMatchingIds(userPassIds, userSearchResultPlaceIds);
      req.userSearchResultPlaceIds = userSearchResultPlaceIds;
      req.userSearchCenterCoordinates = location;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    // if user does not provide passName info - retreive ids of all ski resorts in data base and run findMatchingIds
    try {
      const allResorts = await ResortInfo.find({}).exec();
      const allResortsPlace_ids = allResorts.map((resort) => {
        return { place_id: resort.place_id };
      });
      await findMatchingIds(allResortsPlace_ids, userSearchResultPlaceIds);
      req.userSearchResultPlaceIds = userSearchResultPlaceIds;
      req.userSearchCenterCoordinates = location;
      next();
    } catch (err) {
      next(err);
    }
    // console.log(userSearchResultPlaceIds);
  }

  // compare search results to user selected ski pass and make weather requests for matching locations
  async function findMatchingIds(dbPlace_ids, userSearchResultPlace_ids) {
    let matchCount = 0;
    for (let i = 0; i < dbPlace_ids.length; i++) {
      for (let m = 0; m < userSearchResultPlace_ids.length; m++) {
        if (
          dbPlace_ids[i]?.place_id === userSearchResultPlace_ids[m].place_id
        ) {
          matchCount += 1;
          matchingPassIds.push(userSearchResultPlace_ids[m]);
        }
      }
    }
    console.log(`there are ${matchCount} matching resorts`);
    req.matchingPassIds = matchingPassIds;
  }
  // attach matching pass id's to request object to pass it into next middleware
};
