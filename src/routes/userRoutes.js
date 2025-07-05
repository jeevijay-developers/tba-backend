const express = require("express");
const { getUserDetails } = require("../controllers/user.controller");
const router = express.Router();

router.get("/getuser/:username", getUserDetails);

module.exports = router;
