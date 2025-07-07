const express = require("express");
const {
  getUserDetails,
  approveUser,
  rejectUser,
  approveAll,
  rejectAll,
  getUsers,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/getuser/:id", getUserDetails);
router.put("/approveuser/:id", approveUser);
router.put("/rejectuser/:id", rejectUser);
router.put("/approve-all", approveAll);
router.put("/reject-all", rejectAll);
router.get("/get-users", getUsers);
module.exports = router;
