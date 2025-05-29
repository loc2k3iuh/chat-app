import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSlibar = async (req, res) => {
  try {
    const LoggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: LoggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error In getUsersForSlibar Controller : ", error);
    res.status(500).json({ message: "Internal Server Error !" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error In getMessages Controller : ", error);
    res.status(500).json({ message: "Internal Server Error !" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id : receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error In sendMessage Controller : ", error);
    res.status(500).json({ message: "Internal Server Error !" });
  }
};
