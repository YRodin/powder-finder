const authentication = require("./authentication");
const User = require("../models/user");
const isProduction = process.env.NODE_ENV === 'production';

exports.updateInfo = async (req, res, next) => {
  try {
    // Find the user
    let user = await User.findById(req.user._id);

    // Check and update fields
    if (req.body.userName) {
      user.userName = req.body.userName;
    }

    if (req.body.seasonPass) {
      user.seasonPass = req.body.seasonPass;
    }

    if (req.body.password) {
      user.setPassword(req.body.password);
    }
    // Save the updated user
    await user.save();
    authentication.setCookie(req, res);
    const { userName, seasonPass } = user;
    res.status(200).send({ userName, seasonPass });
  } catch (err) {
    return next(err);
  }
};

exports.delete = function (req, res, next) {
  // delete DB entry
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    } else {
      // erase 'token' cookie 
      res.clearCookie("token", {
        domain: isProduction ? process.env.API_BASE_URL : "localhost",
        path: "/",
        sameSite: "strict",
        secure: isProduction,
        httpOnly: true,
      });
      res.status(204).json({ message: "User deleted successfully" });
    }
  });
};
