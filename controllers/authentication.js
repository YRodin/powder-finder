const jwt = require("jsonwebtoken");
const User = require("../models/user");
const keys = require("../config/dev");

function tokenForUser(user) {
  return jwt.sign(
    {
      sub: user._id,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 + 5 * 60 * 60),
    },
    keys.TOKEN_SECRET
  );
}
exports.tokenForUser = tokenForUser;

exports.signin = function (req, res, next) {
  console.log("Signing in:", req.user);
  const token = tokenForUser(req.user);
  const { userName, seasonPass } = req.user;
  res.send({ userName, seasonPass, token });
};

function tokenWithUserInfo(user) {
  const timestamp = new Date().getTime();
  const { userName, seasonPass } = user;
  return jwt.sign ({ sub: user.id, iat: timestamp, userName, seasonPass }, keys.TOKEN_SECRET );
}

exports.validateAndDecodeToken = function validateAndDecodeToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, keys.TOKEN_SECRET, function(err, decoded) {
      if (err) {
          return res.status(500).json({ error: 'Failed to authenticate token' });
      }
      
      // Attach the decoded user info to the request object
      req.userInfo = decoded;
      next();
  });
}

exports.secureSignin = function (req, res, next) {
  const token = tokenWithUserInfo(req.user);
  res.cookie('token', token, { sameSite: 'none', secure: true, httpOnly: true });
  res.redirect('http://localhost:3000/authenticated');;
}

exports.currentUser = function (req, res, next) {
  console.log(`current user controller is invoked`);
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
    const user = new User({authType: 'local'});
    user.userName = userName;
    user.setPassword(password);
    user.save(function (err, user) {
      if (err) {
        return next(err);
      }
      // Repond to request indicating the user was created
      const token = tokenForUser(user);
      const { userName, seasonPass } = user;
      res.send({ userName, seasonPass, token });
    });
  });
  
};
