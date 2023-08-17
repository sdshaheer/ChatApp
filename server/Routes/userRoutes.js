const express = require("express");
const {
  registerController,
  loginController,
  findUsersController,
} = require("../Controllers/userControllers");
const router = express.Router();
const multer = require("multer");
const authenticateToken = require("../Controllers/jwtController");

const upload = multer({ dest: "uploads/" });

router.post("/register", upload.single("image"), registerController);

router.post("/login", loginController);

router.get("/", authenticateToken, findUsersController);

module.exports = router;
