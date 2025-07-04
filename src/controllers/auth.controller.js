const User = require("../models/User");
const bcrypt = require("bcryptjs");
const uploadToCloudinary = require("../utils/cloudinary");
// POST - Create new user
exports.registerUser = async (req, res) => {
  try {
    const { user } = req.body;

    // check all the required fields
    const requiredFields = ["username", "password", "profession", "bloodGroup"];
    for (const field of requiredFields) {
      if (!user[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    if (!user.name || !user.name.firstname) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!user.email || !user.email.primary) {
      return res.status(400).json({ message: "Primary email is required" });
    }

    if (!user.phone || !user.phone.primary) {
      return res.status(400).json({ message: "Primary phone is required" });
    }

    // check if username already exists
    const userExists = await User.findOne({ username: user.username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // check email uniqueness
    const emailExists = await User.findOne({
      "email.primary": user.email.primary,
    });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User(user);
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created", user: savedUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create user", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ message: "User data is required" });
    }

    // Fetch current user
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block updates to username
    if (user.username && user.username !== existingUser.username) {
      return res.status(400).json({ message: "Username cannot be updated" });
    }

    // Block updates to primary email
    if (
      user.email &&
      user.email.primary &&
      user.email.primary !== existingUser.email.primary
    ) {
      return res
        .status(400)
        .json({ message: "Primary email cannot be updated" });
    }

    // Merge existing user with updated data (shallow merge, handles nested fields if passed fully)
    const updatedData = {
      ...existingUser.toObject(),
      ...user,
      email: {
        ...existingUser.email,
        ...user.email,
        primary: existingUser.email.primary, // force keep original primary email
      },
      username: existingUser.username, // force keep original username
    };

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token (if needed)
    // const token = user.generateAuthToken();

    res.json({ message: "Login successful", user: user });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// GET - Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you pass user ID in the URL
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //
    const imageUpload = await uploadToCloudinary(req.file.buffer);

    if (!imageUpload || !imageUpload.url) {
      return res.status(500).json({ message: "Image upload failed" });
    }
    const imageUrl = imageUpload.url;
    // Update user with the image URL
    user.image = imageUrl; // Assuming you have an 'image' field in your User model
    await user.save();

    res.json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message });
  }
};
