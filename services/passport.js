const passport = require("passport");
const User = require("../models/user");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//define local log in strategy
const localOptions = {
  usernameField: "userName",
  passwordField: "password",
};
const localLogin = new LocalStrategy(localOptions, function (
  userName,
  password,
  done
) {
  User.findOne({ userName: userName }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: "Wrong Password!" });
    }
    return done(null, user);
  });
});

// Setup options for JWT Strategy
const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.TOKEN_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);

// define google oauth20 strategy
const googleAuth20 = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      let user = await User.findOne({ userName: profile.displayName });
      if (!user) {
        // User not found, create a new user
        user = new User({
          userName: profile.displayName,
          googleId: profile.id,
          authType: "google",
        });
        // Save the user to the database
        await user.save();
      }
      // Send the user information to the next middleware
      cb(null, user);
    } catch (err) {
      cb(err, null);
    }
  }
);
// mount local strategy to passport
passport.use(localLogin);
passport.use(jwtLogin);
passport.use(googleAuth20);

