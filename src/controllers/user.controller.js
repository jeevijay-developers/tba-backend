const User = require("../models/User");

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("user id", id);
    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
