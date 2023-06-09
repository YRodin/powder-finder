const authentication = require("./controllers/authentication");
const manageUser = require("./controllers/manageUser");
const dataCollection = require("./controllers/dataCollection");
const passport = require("passport");
const ResortInfo = require("./models/resortInfo");
const { resortFinder } = require("./controllers/resortFinder");
const { weatherInfo } = require("./controllers/weatherInfo");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });


module.exports = function (app) {
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  ); // client click on "sign in with google" is directed here
  app.get(
    "/api/auth/google/callback",
    authentication.googleAuthErrorHandler(),
    authentication.signinWithGoogle
  );;
  app.get("/api/user", authentication.validateAndDecodeToken, (req, res) => {
    const { userName, seasonPass } = req.userInfo;
    res.json({ userName, seasonPass });
  });
  app.post("/api/auth/signin", requireSignin, authentication.signin);
  app.post("/api/auth/signup", authentication.signup);
  // app.get("/api/user", requireAuth, authentication.currentUser);
  app.put("/api/user/updateinfo", requireAuth, manageUser.updateInfo);
  app.delete("/api/user/delete", requireAuth, manageUser.delete);
  // next 3 routes are executed once when app is deployed to retreive all static data necessary to process user requests; refactor to use next(); and chain them in the same route when ready to consolidate
  app.get("/api/getpassinfo", dataCollection.getPassInfo);
  app.get("/api/getresortcoordinates", dataCollection.getResortCoordinates);
  app.post("/api/getresortplaceid", dataCollection.getResortPlaceId);
  app.post("/api/resortfinder", resortFinder, weatherInfo);
};
