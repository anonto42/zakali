import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { User } from "../user/user.model";
import { ChatRoom } from "./chat.model";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { Message } from "./message.model";
import { socketHelper } from "../../../helpers/socketHelper";

const createChat = async (
    sender: any, 
    chatInfo: {
      receiver: any,
      chatName: string
    }, 
  ) => {
  
    const isUser = await User.isValidUser(sender);
    const isRecever = await User.isValidUser( chatInfo.receiver );
    
    if (!isRecever) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Receiver not found");
    };
  
    if (!isUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    };

    if ( isRecever.blockedBy && isRecever.blockedBy.includes(isUser._id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You are blocked by this user");
    };
  
    const isChatExist = await ChatRoom.findOne({
        
      participants: { $all:[ isUser._id, chatInfo.receiver ] }
    }).populate("participants","email name image")
  
    if (!isChatExist) {
      const chatRoom = await ChatRoom.create({
        chatName: chatInfo.chatName,
        participants: [
          sender,
          chatInfo.receiver
        ]
      }
    );
  
      return await chatRoom.populate("participants","email name");
    }
  
    return isChatExist
    
};

const getChatById = async ( 
    payload: JwtPayload,
    id: string 
) => {
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.NOT_FOUND,'Invalid ObjectId');
    }
    
    const chat = await ChatRoom.findById(id).populate("participants", "email name profileImage");
    
    // const chat = new mongoose.Schema({
        // participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        // other fields...
    //   });
      

    if (!chat) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Chat not found!"
        )
    }

    return chat;
};

const allChats = async (
    data: {
      id: string,
      page: number,
      limit: number
    }
  ) => {
    const { id, page = 1, limit = 10 } = data;
  
    const user = await User.isValidUser(id);

    const sue = new mongoose.Types.ObjectId(user._id); 
    const skip = (page - 1) * limit;
  
    const chats = await ChatRoom.find({
      participants: { $in: [sue] }
    })
      .populate("participants", "email name profileImage")
      .skip(skip)
      .limit(limit);
  
    const totalChats = await ChatRoom.countDocuments({
      participants: { $in: [sue] }
    });
  
    return {
      chats,
      totalChats,
      currentPage: page,
      totalPages: Math.ceil(totalChats / limit),
    };
};
  
const deleteChat = async ( 
    userID: string, 
    id: string 
) => {
    const user = await User.isValidUser(userID);
  
    const objID = new mongoose.Types.ObjectId(id);   
    const chatRoom = await ChatRoom.findById(objID);
    if (!chatRoom) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Chat not founded!`
      ); 
    };
    
    const isInChat = chatRoom.participants.filter( ( e: any ) => e.toString() === user._id.toString() );
    if (!isInChat) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `You are not a member of this chat so you can delete this chat`
      );
    };
  
    await ChatRoom.deleteOne({ _id: chatRoom._id });

    // Delete all messages of the chat room 
    await Message.deleteMany({ chatRoom: chatRoom._id });
  
    return true
  
};

const sendMessage = async ( 
    payload: JwtPayload,
) => {
    
    const user = await User.isValidUser(payload.id);
    
    const chatRoomObjId = new mongoose.Types.ObjectId(payload.chatRoom);
    const chatRoom = await ChatRoom.findById(chatRoomObjId);
    if (!chatRoom) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Chat not founded!`
      ); 
    };

    const otherUser = chatRoom.participants.filter( ( e: any ) => e.toString() !== user._id.toString() );

    console.log({
      user: user.blockedBy,
      otherUser,
      cll: !user.blockedBy.includes(otherUser[0].toString()),
      lsl: user.blockedBy.length > 0
    })

    if (user.blockedBy.length > 0 && user.blockedBy[0].toString() == otherUser[0].toString()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You are blocked by this user");
    };
    
    // return

    const isInChat = chatRoom.participants.filter( ( e: any ) => e.toString() === user._id.toString() );
    if (!isInChat) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `You are not a member of this chat so you can delete this chat`
      );
    };

    const message = await Message.create({
      sender: user._id,
      content: payload.content,
      chatRoom: chatRoom._id
    });

    //@ts-ignore
    const io = global.io;


    // Emit Message
    const targetedSocketID = socketHelper.connectedUsers.get(otherUser[0].toString());
    console.log(otherUser[0].toString());
    console.log(targetedSocketID);
    console.log(otherUser[0].toString());
    if ( targetedSocketID ) {
      io.to(targetedSocketID).emit(`socket:message:${otherUser[0].toString()}`, message);
    };

    return message;
};

const getMessages = async (
    payload: JwtPayload,
    id: string,
    options: {
        page: number,
        limit: number
    }
) => {

    const { page = 1, limit = 10 } = options;
    
    const chatRoomObjId = new mongoose.Types.ObjectId(id);
    const chatRoom = await ChatRoom.findById(chatRoomObjId);
    if (!chatRoom) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Chat not founded!`
      ); 
    };

    const messages = await Message.find({ chatRoom: chatRoom._id })
      .populate("sender", "email name profileImage")
      .skip((page - 1) * limit)
      .limit(limit);
    
    const totalMessages = await Message.countDocuments({ chatRoom: chatRoom._id });
    
    return {
      messages,
      totalMessages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
    };
    
};

const deleteMessages = async (
    id: string
) => {
    const objid = new mongoose.Types.ObjectId(id);
    const message = await Message.findByIdAndDelete(objid);
    if (!message) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Message not founded!`
      ); 
    };
    return message;
};

const blockUser = async (
  payload: JwtPayload,
  id: string    
) => {
  const UserObjID = new mongoose.Types.ObjectId(payload.id);
  const blockedUserObjID = new mongoose.Types.ObjectId(id);

  const blockUser = await User.findById(blockedUserObjID);
  if (!blockUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `User not founded!`
    ); 
  };

  const isBlocked = blockUser.blockedBy.filter( ( e: any ) => e.toString() === UserObjID.toString() );

  if (isBlocked.length > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You are already blocked this user!`
    ); 
  };

  blockUser.blockedBy.push(UserObjID);
  await blockUser.save();

  return "DONE";
};

const unblockUser = async (
  payload: JwtPayload,
  id: string    
) => {
  const UserObjID = new mongoose.Types.ObjectId(payload.id);
  const blockedUserObjID = new mongoose.Types.ObjectId(id);

  const blockUser = await User.findById(blockedUserObjID);
  if (!blockUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `User not founded!`
    ); 
  };

  if (blockUser.blockedBy.length <= 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You are not blocked this user!`
    ); 
  };

  if (
    blockUser.blockedBy.length > 0 &&
    !blockUser.blockedBy.includes(UserObjID)
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You are not blocked this user!`
    ); 
  };

  blockUser.blockedBy = blockUser.blockedBy.filter( ( e: any ) => e.toString() !== UserObjID.toString() );
  await blockUser.save();

  return "DONE";
};

// Have to add block online status live socket audio video

export const communicationService = {
  getChatById,
  deleteChat,
  createChat,
  allChats,
  ...{
    sendMessage,
    getMessages,
    deleteMessages,
    ...{
      blockUser,
      unblockUser
    }
  }
};