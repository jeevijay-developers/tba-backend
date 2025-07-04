const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Gallery", gallerySchema);
