const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Chat = require("../models/Chat");

const router = express.Router();

/**
 * 🔹 SEND MESSAGE
 */
router.post("/", protect, async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({
        message: "Content and chatId are required",
      });
    }

    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
      seenBy: [req.user._id], // sender has seen it
    });

    // Populate sender + chat
    message = await message.populate("sender", "name email");
    message = await message.populate({
      path: "chat",
      populate: {
        path: "users",
        select: "name email",
      },
    });

    // ✅ Update latestMessage in Chat
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🔹 GET ALL MESSAGES OF A CHAT
 */
router.get("/:chatId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name email")
      .populate("seenBy", "name");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 🔹 MARK MESSAGE AS SEEN
 */
router.patch("/seen/:id", protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { seenBy: req.user._id },
      },
      { new: true }
    )
      .populate("sender", "name email")
      .populate("seenBy", "name");

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
