// controllers/userController.js
const User = require("../models/user");

// update own profile
const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update only provided fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // will be hashed by pre-save middleware

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateUser };
