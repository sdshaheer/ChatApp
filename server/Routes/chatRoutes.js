const express = require("express");
const authenticateToken = require("../Controllers/jwtController");
const {
  accessChatController,
  fetchAllChatsController,
  createGroupChatController,
  renameGroupChatController,
  addToGroupChatController,
  deleteFromGroupChatController,
} = require("../Controllers/chatController");

const router = express.Router();

// creates or access chat of user with other user
router.post("/accessChat", authenticateToken, accessChatController);

// fetches all chats of user
router.get("/fetchChats", authenticateToken, fetchAllChatsController);

// creates group chat
router.post("/createGroupChat", authenticateToken, createGroupChatController);

//  rename group chat
router.put("/renameGroupChat", authenticateToken, renameGroupChatController);

//  add new user to group chat
router.put("/addToGroupChat", authenticateToken, addToGroupChatController);

//  add new user to group chat
router.put(
  "/deleteFromGroupChat",
  authenticateToken,
  deleteFromGroupChatController
);

module.exports = router;
