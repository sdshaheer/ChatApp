const messageModel = require("../Models/messageModel");
const userModel = require("../Models/userModel");
const chatModel = require("../Models/chatModel");

exports.sendMessageController = async (req, res) => {
  try {
    console.log("in send message controller");
    const { content, chatId } = req.body;
    console.log(content, chatId);
    if (!content || !chatId) {
      return res.status(400).send({
        success: false,
        message: "Invalid data passes to request",
      });
    }

    let message = new messageModel({
      sender: req.userId,
      chat: chatId,
      content: content,
    });

    await message.save();

    message = await message.populate("sender", "-password");
    await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name email profilePicture",
    });

    //console.log(message);

    return res.status(200).send({
      success: true,
      message: "message sent successfully",
      sentMessage: message,
    });
  } catch (error) {
    return res.status(200).send({
      success: true,
      message: "error in sending message",
      error,
    });
  }
};

exports.allMessagesByChatIdController = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");
    return res.status(200).send({
      success: true,
      message: "successfully fetched all messages by chat id",
      messages,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "error in fetching messages by chat id",
      error,
    });
  }
};
