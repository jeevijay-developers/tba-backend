const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: String,
  image: {
    type: String,
    default:
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  name: {
    firstname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    middlename: String,
    lastname: String,
  },
  profession: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    primary: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    alternate: String,
  },
  phone: {
    primary: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    alternate: String,
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  maritalInfo: {
    status: String,
    spouseName: String,
    date: String,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  DOB: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  address: {
    residential: {
      addressLine: String,
      pincode: String,
      city: String,
      state: String,
      phone: String,
    },
    office: {
      addressLine: String,
      pincode: String,
      city: String,
      state: String,
      phone: String,
    },
  },
  approve: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    next(err); // pass error to Mongoose error handler
  }
});

module.exports = mongoose.model("User", userSchema);
