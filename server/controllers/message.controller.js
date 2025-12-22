import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.middleware.js ";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSockerId } from "../utils/socket.js";
import { io } from "../utils/socket.js";
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const filteredUsers = await User.find({ _id: { $ne: user._id } }).select(
    "-password"
  );
  return res.status(200).json({
    success: true,
    users: filteredUsers,
  });
});
export const getMessages = catchAsyncErrors(async (req, res, next) => {
  const receivedId = req.params.id;
  const myId = req.user._id;
  const receiver = User.findById(receivedId);
  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: receivedId },
      { senderId: receivedId, receiverId: myId },
    ],
  });

  return res.status(200).json({
    success: true,
    messages,
  });
});
export const sendMessages = catchAsyncErrors(async (req, res, next) => {
  const { text } = req.body;
  const media = req.files?.media;
  console.log({ media });

  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver ID Invalid",
    });
  }

  const sanitizedText = text?.trim() || "";
  if (!sanitizedText && !media) {
    return res.status(400).json({
      success: false,
      message: "Message cannot be empty",
    });
  }

  let mediaUrl = "";

  if (media) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(
        media.tempFilePath,
        {
          resourse_type: "auto",
          folder: "CHAT_APP_MEDIA",
          transformation: [
            { width: 1080, height: 1080, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );
      mediaUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload media",
      });
    }
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text: sanitizedText,
    media: mediaUrl,
  });

  const receiverSocketId = getReceiverSockerId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res.status(201).json({
    message: newMessage,
    success: true,
  });
});
