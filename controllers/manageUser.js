const authentication = require("./authentication");
const User = require("../models/user");

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

    // Generate new token for user
    const token = authentication.tokenForUser(user._id);

    // Set cookie with jwt send response back to client
    res.cookie('token', token, { sameSite: 'none', secure: true, httpOnly: true });
    res.status(200).send({
      userName: user.userName,
      seasonPass: user.seasonPass,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete = function (req, res, next) {
  // delete DB entry
  // redirect to /home
  User.findByIdAndDelete(req.user._id, (err, user) => {
    if (err) {
      return next(err);
    } else {
      res.status(204).json({ message: "User deleted successfully" });
    }
  });
};
