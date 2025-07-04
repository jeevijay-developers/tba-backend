const {
  uploadGalleryImageasync,
  uploadEventGalleryImage,
  getGallery,
  getEventGallery,
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

module.exports = router;
