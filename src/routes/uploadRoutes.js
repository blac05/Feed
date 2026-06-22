import express from "express";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";
import {
  uploadImage, uploadAvatar,
  uploadVideo, uploadStoryMedia,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post("/image", auth, upload.single("image"), uploadImage);
router.post("/avatar", auth, upload.single("avatar"), uploadAvatar);
router.post("/video", auth, upload.single("video"), uploadVideo);
router.post("/story", auth, upload.single("media"), uploadStoryMedia);

export default router;
