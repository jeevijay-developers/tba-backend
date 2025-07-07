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

exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGallery = await Gallery.findByIdAndDelete(id);
    if (!deletedGallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteEventGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await EventGallery.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event gallery not found" });
    }
    res.status(200).json({ message: "Event gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting event gallery:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.status(200).json(gallery);
  } catch (error) {
    console.error("Error fetching gallery by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getEventGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventGallery = await EventGallery.findById(id);
    if (!eventGallery) {
      return res.status(404).json({ error: "Event gallery not found" });
    }
    res.status(200).json(eventGallery);
  } catch (error) {
    console.error("Error fetching event gallery by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateEventGalleryById = async (req, res) => {
  try {
    const {blog} = req.body
    console.log("blog ---> ",blog);
    
    if(blog.blog.bhead === ""  || blog.blog.blogPara1 === "" || blog.title === "" || blog.desc === "" ){
      return res.status(400).json({message: "All the fields are required"});
    }

    const BLOG = await EventGallery.findById(blog._id)
    if(!BLOG) return res.status(404).json({message: "Event not found"})

    BLOG.title = blog.title
    BLOG.desc = blog.desc
    BLOG.blog.bhead = blog.blog.bhead
    BLOG.blog.blogPara1 = blog.blog.blogPara1

    await BLOG.save()
    return res.status(200).json({message: "Event updated succesfully"})

  } catch (error) {
    console.error("Error updating event gallery by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
}

exports.updateGalleryById = async (req,res) => {
  try {
    const {gallery} = req.body 
    console.log("Gallery -->", gallery);

    const GALLERY = await Gallery.findById(gallery._id)

    if(!GALLERY) return res.satus(404).json({message: "Gallery not found"})

      GALLERY.title = gallery.title

      await GALLERY.save()
      return res.status(200).json({message: "Gallery updated successfully"})

  } catch (error) {
    console.error("Error updating gallery by ID:", error);
    res.status(500).json({ error: "Server Error" });
  }
}

exports.addImagesInGallery = async (req, res) => {
  try {
    const gallery = JSON.parse(req.body.gallery);
    console.log("Gallery --> ", gallery);

    const GALLERY = await Gallery.findById(gallery._id);
    if (!GALLERY) {
      return res.status(404).json({ message: "No gallery found" });
    }

    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res.status(400).json({ error: "Images are required." });
    }

    const uploadedImages = [];

    for (const file of req.files.images) {
      const result = await uploadToCloudinary(file.buffer);
      uploadedImages.push({ url: result.url });
    }

    GALLERY.images.push(...uploadedImages);
    const savedGallery = await GALLERY.save();

    return res.status(201).json(savedGallery);
  } catch (error) {
    console.error("Error adding images in gallery", error);
    res.status(500).json({ error: "Server Error" });
  }
};
