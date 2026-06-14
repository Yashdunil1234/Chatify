// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const Chat = require("../models/Chat");

// const router = express.Router();


// router.get("/", protect, async (req, res) => {
//   try {
//     const chats = await Chat.find({
//       users: { $elemMatch: { $eq: req.user._id } },
//     })
//       .populate("users", "-password")
//       .populate({
//         path: "latestMessage",
//         populate: {
//           path: "sender",
//           select: "name email",
//         },
//       })
//       .sort({ updatedAt: -1 });

//     res.json(chats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });


// router.post("/", protect, async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({
//         message: "userId is required",
//       });
//     }

    
//     let existingChat = await Chat.findOne({
//       isGroupChat: false,
//       users: { $all: [req.user._id, userId] },
//     })
//       .populate("users", "-password")
//       .populate({
//         path: "latestMessage",
//         populate: {
//           path: "sender",
//           select: "name email",
//         },
//       });

//     if (existingChat) {
//       return res.json(existingChat);
//     }

  
//     const newChat = await Chat.create({
//       chatName: "sender",
//       isGroupChat: false,
//       users: [req.user._id, userId],
//     });

//     const fullChat = await Chat.findById(newChat._id)
//       .populate("users", "-password");

//     res.status(201).json(fullChat);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

// routes/chatRoutes.js - Complete Chat Routes with Group Functionality

const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/chats
// @desc    Create or get one-to-one chat
router.post("/", protect, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const chat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(chat._id)
      .populate("users", "-password")
      .populate("latestMessage");

    res.status(201).json(fullChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/chats
// @desc    Get all chats for logged in user
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/chats/group
// @desc    Create a group chat
router.post("/group", protect, async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!users || users.length < 2) {
      return res.status(400).json({ message: "Group must have at least 2 members" });
    }

    // Add current user as admin
    users.push(req.user._id);

    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/chats/group/rename
// @desc    Rename group chat
router.put("/group/rename", protect, async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can rename group" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/chats/group/add
// @desc    Add user to group
router.put("/group/add", protect, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: "User already in group" });
    }

    chat.users.push(userId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/chats/group/remove
// @desc    Remove user from group
router.put("/group/remove", protect, async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    chat.users = chat.users.filter(
      (id) => id.toString() !== userId.toString()
    );
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/chats/group/leave
// @desc    Leave group
router.put("/group/leave", protect, async (req, res) => {
  try {
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "Not a group chat" });
    }

    chat.users = chat.users.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    // If admin leaves, assign new admin
    if (chat.groupAdmin.toString() === req.user._id.toString()) {
      if (chat.users.length > 0) {
        chat.groupAdmin = chat.users[0];
      }
    }

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;