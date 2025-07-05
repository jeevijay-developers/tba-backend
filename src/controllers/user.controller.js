const User = require("../models/User");

exports.getUserDetails = async (req,res) => {

  try{
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  }
  catch(error){
    console.error("Get user details error:", error);
  }

};
