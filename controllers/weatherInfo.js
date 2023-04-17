const resortFinder = require("./resortFinder");
const ResortInfo = require("../models/resortInfo");
const axios = require("axios");

// following function makes request to DB with place_id's passed from req.matchingPassIds, and returns array of objects, one for each matching resort {place_id: String, coordinates: {lat, lon}}
async function retreiveMatchingResorts(req, res, next) {
  const place_idStrings = req.matchingPassIds.map((obj) => {
    return obj.place_id;
  });
  const test = await ResortInfo.find({ place_id: { $in: place_idStrings } })
    .then((foundResorts) => {
      const resorts = foundResorts;
      return resorts;
    })
    .catch((err) => {
      return next(err);
    });
  req.matchingResorts = test;
}
// following function handles weather data search, returns array matchingResortsWithSnowTotals with objects containing: place_id: String, coordinates: Object, snowfallSumm: Number
async function getSnowAccumulationData(req, res, next) {
  // this function sets proper start date for snow accumulation api call
  function getStartDate() {
    const now = new Date();
    // if current month is between december-oct (newYear inseason + offseason) - set start date as nov 1st of previous year
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(now.getMonth())) {
      const sd = new Date(now.getFullYear() - 1, 10, 1);
      const year = sd.getFullYear();
      const month = (sd.getMonth() + 1).toString().padStart(2, "0");
      const day = sd.getDate().toString().padStart(2, "0");
      const sdString = `${year}-${month}-${day}`;
      return sdString;
      // if current month is nov or dec, set start date as nov 1st of current year
    } else {
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const sdString = `${year}-${month}-${day}`;
      return sdString;
    }
  }
  // this function sets proper end date for snow accumulation api call
  function getEndDate() {
    const now = new Date();
    // if current month is between apr-oct (offseason) - set end date as last date of season
    if ([3, 4, 5, 6, 7, 8, 9].includes(now.getMonth())) {
      const ed = new Date(now.getFullYear(), 2, 31);
      const year = ed.getFullYear();
      const month = (ed.getMonth() + 1).toString().padStart(2, "0");
      const day = ed.getDate().toString().padStart(2, "0");
      const edString = `${year}-${month}-${day}`;
      return edString;
      // if current month is (inseason) nov or dec, jan, feb or mar - set end date as current date
    } else {
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      const edString = `${year}-${month}-${day}`;
      return edString;
    }
  }
  // this function sums up seasonal snow accumulation
  function snowfallSumm(array) {
    return array.reduce((acc, val) => {
      if (typeof val === "number" && !isNaN(val)) {
        return acc + val;
      } else {
        return acc;
      }
    }, 0);
  }
  //
  try {
    const weatherDataQueries = req.matchingResorts.map((element) => {
      return axios.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${
          element.coordinates.lat
        }&longitude=${
          element.coordinates.lon
        }&start_date=${getStartDate()}&end_date=${getEndDate()}&daily=snowfall_sum&timezone=America%2FNew_York&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
      );
    });
    const weatherDataResponses = await Promise.allSettled(weatherDataQueries);
    const weatherDataResponsesFiltrd = weatherDataResponses.map(element => parseFloat(snowfallSumm(element?.value?.data?.daily?.snowfall_sum).toFixed(2))); 
    console.log('below are weatherDataResponsesFiltr obj.value?.data line 84 weatherInfo.js');
    console.log(weatherDataResponsesFiltrd);
    const matchingResortsWithSnowTotals = req.matchingResorts.map(
      (resort, index) => {
        return {
          coordinates: {lat:resort.coordinates.lat, lon: resort.coordinates.lon},
          _id: resort._id,
          city: resort.city,
          state: resort.state,
          pass: resort.pass,
          name: resort.name,
          place_id: resort.place_id,
          snowfallSumm: weatherDataResponsesFiltrd[index]
        };
      }
    );
     req.matchingResortsWithSnowTotals = matchingResortsWithSnowTotals;
     console.log('below are req.matchingResortsWithSnowTotals on line 103 of weatherInfo.js');
     console.log(req.matchingResortsWithSnowTotals);
  } catch (err) {
    next(err);
  }
}
exports.weatherInfo = async function (req, res, next) {
  try {
    await retreiveMatchingResorts(req, res, next);
    await getSnowAccumulationData(req, res, next);
    if (req.matchingResortsWithSnowTotals.length > 0) {
      res.status(200).json({
        matchingResorts: req.matchingResortsWithSnowTotals,
        userSearchCenterCoordinates: req.userSearchCenterCoordinates
      });
    } else {
      res.status(404).json({
        message : "No Matching Resorts Found",
        status : 404,
        errors : null
      });
    };
  } catch (err) {
    console.log(err);
    next(err);
  }
};
