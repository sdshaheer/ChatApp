const express = require("express");
const cloudinary = require("../Utils/cloudinary");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("in file controller");
    //console.log(req);
    const file = req.file;
    console.log(file);

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "PROFILE_PICTURES",
    });

    const imageUrl = result.secure_url;

    res.status(200).send({
      success: true,
      message: "profile saved successfully",
      imageUrl,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      success: false,
      message: "something went wrong in profile uploading",
      error,
    });
  }
});

module.exports = router;
