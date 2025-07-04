const {
  registerUser,
  loginUser,
  uploadImage,
  getUsers,
  updateUser,
} = require("../controllers/auth.controller");
const upload = require("../utils/multer");

const router = require("express").Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/upload-image/:id", upload.single("image"), uploadImage);
router.put("/users/:id", updateUser);
router.get("/users", getUsers);

module.exports = router;
