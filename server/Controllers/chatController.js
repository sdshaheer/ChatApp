const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");

exports.accessChatController = async (req, res) => {
  try {
    console.log("in access chat controller");
    const { otherUserId, chatName } = req.body;
    if (!otherUserId) {
      return res.status(400).send({
        success: false,
        message: "second person id not sent",
      });
    }

    console.log("requser", req.userId);
    console.log("otheruser", otherUserId);
    let isChat = chatModel
      .findOne({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.userId } } },
          { users: { $elemMatch: { $eq: otherUserId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email profilePicture",
    });

    console.log("ischat", isChat);

    if (isChat) {
      console.log();
      return res.status(200).send({
        success: true,
        message: "chat details found successfully",
        isChat,
      });
    } else {
      const chatData = {
        name: "sender",
        isGroupChat: false,
        users: [req.userId, otherUserId],
      };

      const newChat = new chatModel(chatData);
      await newChat.save();

      isChat = await chatModel
        .findOne({ _id: newChat._id })
        .populate("users", "-password")
        .populate("latestMessage");

      return res.status(200).send({
        success: true,
        message: "chat created successfully",
        isChat,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in accessing single chat",
      error,
    });
  }
};

exports.fetchAllChatsController = async (req, res) => {
  console.log("in fetch all chats controller");
  try {
    let chats = await chatModel
      .find({
        users: { $elemMatch: { $eq: req.userId } },
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await userModel.populate(chats, {
      path: "latestMessage.sender",
      select: "name email profilePicture",
    });

    return res.status(200).send({
      success: true,
      message: "successfully fetched all chats of user",
      chats,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in fetching user chats",
      error,
    });
  }
};

exports.createGroupChatController = async (req, res) => {
  try {
    console.log("in create group chat controller");
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }

    //var users = JSON.parse(req.body.users);
    var users = req.body.users;

    if (users.length < 2) {
      return res.status(400).send({
        success: false,
        message: "more than 2 users required to create group chat",
      });
    }

    users.push(req.userId);
    console.log(users);

    const newGroupChat = new chatModel({
      name: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.userId,
    });
    await newGroupChat.save();

    const groupChat = await chatModel
      .findOne({
        _id: newGroupChat._id,
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send({
      success: true,
      message: "group chat created successfully",
      groupChat,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in creating group chat",
      error,
    });
  }
};

exports.renameGroupChatController = async (req, res) => {
  try {
    console.log("in rename group chat controller");
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(chatId, { name: chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send({
      success: true,
      message: "chat name updated successfully",
      updatedChat,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in creating group chat",
      error,
    });
  }
};

exports.addToGroupChatController = async (req, res) => {
  try {
    console.log("in add to group chat controller");
    const { chatId, userId } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send({
      success: true,
      message: "new user is successfully added to group",
      updatedChat,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in adding new user to group chat",
      error,
    });
  }
};

exports.deleteFromGroupChatController = async (req, res) => {
  try {
    console.log("in delete from group chat controller");
    const { chatId, userId } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send({
      success: true,
      message: "deleted user from group Successfully",
      updatedChat,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in deleting user from group chat",
      error,
    });
  }
};
