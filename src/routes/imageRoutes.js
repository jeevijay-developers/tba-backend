const {
  uploadGalleryImageasync,
  uploadEventGalleryImage,
  getGallery,
  getEventGallery,
  deleteGallery,
  deleteEventGallery,
  getEventGalleryById,
  getGalleryById,
  updateEventGalleryById,
  updateGalleryById,
  addImagesInGallery
} = require("../controllers/image.controller");
const upload = require("../utils/multer");
const express = require("express");
const router = express.Router();

router.post("/gallery", upload.array("images"), uploadGalleryImageasync);
router.post(
  "/event-gallery",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "bImage1", maxCount: 1 },
  ]),
  uploadEventGalleryImage
);

router.get("/get-gallery", getGallery);
router.get("/get-event-gallery", getEventGallery);

router.delete("/gallery/:id", deleteGallery);
router.delete("/event-gallery/:id", deleteEventGallery);
router.get("/get-event-gallery/:id", getEventGalleryById);
router.get("/get-gallery/:id", getGalleryById);
router.put("/update-event-gallery", updateEventGalleryById)
router.put("/update-gallery", updateGalleryById)
router.post("/add-images-in-gallery", upload.fields([
    { name: "images", maxCount: 10 },
    { name: "gallery", maxCount: 1 }
  ]), addImagesInGallery)

module.exports = router;
