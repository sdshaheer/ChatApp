const express = require("express");
const authenticateToken = require("../Controllers/jwtController");
const {
  sendMessageController,
  allMessagesByChatIdController,
} = require("../Controllers/messageController");

const router = express.Router();

router.post("/sendMessage", authenticateToken, sendMessageController);

router.get(
  "/allMessagesByChatId/:chatId",
  authenticateToken,
  allMessagesByChatIdController
);

module.exports = router;
