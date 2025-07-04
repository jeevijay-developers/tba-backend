const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  bhead: { type: String, required: true },
  blogPara1: { type: String, required: true },
  bImage1: { type: String, required: true }, // URL
});

const eventGallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    bannerImage: { type: String, required: true }, // URL
    desc: { type: String, required: true },
    blog: blogSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventGallery", eventGallerySchema);
