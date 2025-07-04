const uploadToCloudinary = require("../utils/cloudinary");
const Gallery = require("../models/Gallery");
const EventGallery = require("../models/EventGallery");

exports.uploadGalleryImageasync = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Title and images are required." });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      uploadedImages.push({ url: result.url });
    }

    const newGallery = new Gallery({
      title,
      images: uploadedImages,
    });

    const savedGallery = await newGallery.save();
    res.status(201).json(savedGallery);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Server error uploading images." });
  }
};

exports.uploadEventGalleryImage = async (req, res) => {
  try {
    const { title, desc, bhead, blogPara1 } = req.body;

    if (
      !title ||
      !desc ||
      !bhead ||
      !blogPara1 ||
      !req.files?.bannerImage ||
      !req.files?.bImage1
    ) {
      return res
        .status(400)
        .json({ error: "All fields and both images are required." });
    }

    // Upload images
    const bannerUpload = await uploadToCloudinary(
      req.files.bannerImage[0].buffer
    );
    const blogImageUpload = await uploadToCloudinary(
      req.files.bImage1[0].buffer
    );

    // Save to DB
    const newEvent = new EventGallery({
      title,
      desc,
      bannerImage: bannerUpload.url,
      blog: {
        bhead,
        blogPara1,
        bImage1: blogImageUpload.url,
      },
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getEventGallery = async (req, res) => {
  try {
    const events = await EventGallery.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching event galleries:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
