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

exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { approve: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User approved successfully", user });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID not provided" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { approve: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User rejected successfully", user });
  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveAll = async (req, res) => {
  try {
    const users = await User.updateMany({ approve: false }, { approve: true });
    res.json({ message: "All users approved successfully", users });
  } catch (error) {
    console.error("Approve all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectAll = async (req, res) => {
  try {
    const users = await User.updateMany({ approve: true }, { approve: false });
    res.json({ message: "All users rejected successfully", users });
  } catch (error) {
    console.error("Reject all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
