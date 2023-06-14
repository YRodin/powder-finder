const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.tokenForUser = function (user) {
  console.log('following is user._id passed into jwt.sign');
  console.log(user._id);
  return jwt.sign(
    {
      sub: user._id,
      iat: Math.round(Date.now() / 1000),
      exp: Math.round(Date.now() / 1000 + 5 * 60 * 60),
    },
    process.env.TOKEN_SECRET
  );
}

exports.signin = function (req, res, next) {
  console.log('req.user inside exports.signin is');
  console.log(req.user);
  const token = exports.tokenForUser(req.user);
  const { userName, seasonPass } = req.user;
  res.cookie('token', token, { domain: 'localhost', path: '/', sameSite: 'strict', secure: false, httpOnly: true });

  res.status(200).send({ userName, seasonPass });
};

exports.signinWithGoogle = function (req, res, next) {
  const token = tokenWithUserInfo(req.user);
  res.cookie('token', token, { domain: 'localhost', path: '/', sameSite: 'strict', secure: false, httpOnly: true });

  res.redirect('http://localhost:3000/authenticated');
}

function tokenWithUserInfo(user) {
  const timestamp = new Date().getTime();
  const { userName, seasonPass } = user;
  return jwt.sign ({ sub: user.id, iat: timestamp, userName, seasonPass }, process.env.TOKEN_SECRET );
}

exports.validateAndDecodeToken = function validateAndDecodeToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ error: 'No token provided' });
  }
  jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
      if (err) {
          return res.status(500).json({ error: 'Failed to authenticate token' });
      }
      // Attach the decoded user info to the request object
      req.userInfo = decoded;
      next();
  });
}

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
    const user = new User({authType: 'local'});
    user.userName = userName;
    user.setPassword(password);
    user.save(function (err, user) {
      if (err) {
        return next(err);
      }
      // Repond to request indicating the user was created
      const token = exports.tokenForUser(user);
      const { userName, seasonPass } = user;
      res.cookie('token', token, { domain: 'localhost', path: '/', sameSite: 'strict', secure: false, httpOnly: true });

      res.status(200).send({ userName, seasonPass });
    });
  });
  
};
