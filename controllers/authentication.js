const jwt = require("jsonwebtoken");
const User = require("../models/user");
const passport = require("passport");
const isProduction = process.env.NODE_ENV === 'production';


exports.tokenForUser = function (user) {
  return jwt.sign(
    {
      sub: user._id,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 + 5 * 60 * 60),
    },
    process.env.TOKEN_SECRET
  );
};

exports.tokenWithUserInfo = function (user) {
  const timestamp = new Date().getTime();
  const { userName, seasonPass } = user;
  return jwt.sign(
    { sub: user.id, iat: timestamp, userName, seasonPass },
    process.env.TOKEN_SECRET
  );
}

exports.setCookie = function(req, res) {
  const token = exports.tokenWithUserInfo(req.user);
  // erase cookie 'token' cookie before setting new one
  res.clearCookie('token', {
    domain: isProduction ? process.env.API_BASE_URL : 'localhost',
    path: "/",
    sameSite: "strict",
    secure: isProduction,
    httpOnly: true,
  });
  // set a brand new 'token' cookie
  res.cookie("token", token, {
    domain: isProduction ? process.env.API_BASE_URL : 'localhost',
    path: "/",
    sameSite: "strict",
    secure: isProduction,
    httpOnly: true,
  });
};

exports.signin = function (req, res, next) {
  const { userName, seasonPass } = req.user;
  exports.setCookie(req, res);
  res.status(200).send({ userName, seasonPass });
};

exports.signinWithGoogle = function (req, res, next) {
  exports.setCookie(req, res);
  res.redirect(`${process.env.CLIENT_URL}/authenticated`);
};

exports.googleAuthErrorHandler = function () {
  return function (req, res, next) {
    passport.authenticate(
      "google",
      { session: false },
      function (err, user, info) {
        if (err) {
          return res.redirect(
            "/loginerror" +
              "?error=" +
              encodeURIComponent(err.message)
          );
        }
        if (!user) {
          return res.redirect(
            "/loginerror" + "?error=Authentication%20failed"
          );
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

exports.validateAndDecodeToken = function validateAndDecodeToken(
  req,
  res,
  next
) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }
    // Attach the decoded user info to the request object
    req.userInfo = decoded;
    next();
  });
};

exports.currentUser = function (req, res, next) {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    }
    res.json(user);
  });
};

exports.signup = function (req, res, next) {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return res
      .status(422)
      .send({ error: "You must provide userName and password" });
  }

  // See if a user with the given userName exists
  User.findOne({ userName: userName }).exec((error, existingUser) => {
    if (error) {
      return next(error);
    }
    // If a user with userName does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "userName is in use" });
    }
    // If a user with userName does NOT exist, create and save user record
    const user = new User({ authType: "local" });
    user.userName = userName;
    user.setPassword(password);
    user.save(function (err, user) {
      if (err) {
        return next(err);
      }
      // Repond to request indicating the user was created
      const { userName, seasonPass } = user;
      const token = exports.tokenWithUserInfo(user);
      // erase cookie 'token' cookie before setting new one
      res.clearCookie('token', {
        domain: isProduction ? process.env.API_BASE_URL : 'localhost',
        path: "/",
        sameSite: "strict",
        secure: isProduction,
        httpOnly: true,
      });
      // set a brand new 'token' cookie
      res.cookie("token", token, {
        domain: isProduction ? process.env.API_BASE_URL : 'localhost',
        path: "/",
        sameSite: "strict",
        secure: isProduction,
        httpOnly: true,
      });
      res.status(200).send({ userName, seasonPass });
    });
  });
};

