import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { StatusCodes } from "http-status-codes";
import { communicationService } from "./communication.service";
import { getSingleFilePath } from "../../../shared/getFilePath";

const createChat = catchAsync(async (
    req: Request, 
    res: Response
  ) => {
    const user = req.user;
    const { ...verifyData } = req.body;
  
    const result = await communicationService.createChat(user.id, verifyData);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Chat room get successfull",
      data: result,
    });
});

const getChatById = catchAsync(async (
    req: Request, 
    res: Response
  ) => {
    const user = req.user;
    const { id } = req.params;
  
    const result = await communicationService.getChatById(user,id);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Chat room get successfull",
      data: result,
    });
});

const allChats = catchAsync(async (
    req: Request, 
    res: Response
  ) => {
    const user = req.user;

    const data = {
        ...req.body,
        id: user.id
    }
  
    const result = await communicationService.allChats(data);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Chat room get successfull",
      data: result,
    });
});

const deleteChat = catchAsync(async (
    req: Request, 
    res: Response
  ) => {
    const user = req.user;
    const { id } = req.params;
  
    const result = await communicationService.deleteChat(user.id,id);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Chat room deleted successfull",
      data: result,
    });
});

const sendMessage = catchAsync(async(
    req: Request,
    res: Response
  ) => {
    const user = req.user;

    const { ...verifyData } = req.body;

    const image = getSingleFilePath(req.files, 'image');

    let message = image ? image : verifyData.content;
  
    const data = { 
        chatRoom: verifyData.chatRoom,
        content: message,
        sender: user.id,
        id: user.id
    }

    const result = await communicationService.sendMessage(data);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Message send successfull",
      data: result,
    });
});

const getMessages = catchAsync(async(
    req: Request,
    res: Response
  ) => {
    const user = req.user;
    const { page, limit , chatID } = req.body;
  
    const result = await communicationService.getMessages(user,chatID,{ page, limit });
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Message get successfull",
      data: result,
    });
});

const deleteMessages = catchAsync(async(
    req: Request,
    res: Response
  ) => {
    const { id } = req.query;
  
    const result = await communicationService.deleteMessages(id as string);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Message deleted successfull",
      data: result,
    });
});

const blockUser = catchAsync(async(
    req: Request,
    res: Response
  ) => {
    const user = req.user;

    const { id } = req.params;
  
    const result = await communicationService.blockUser(user,id);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User blocked successfull",
      data: result,
    });
});

const unblockUser = catchAsync(async(
    req: Request,
    res: Response
  ) => {
    const user = req.user;

    const { id } = req.params;
  
    const result = await communicationService.unblockUser(user,id);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User unblocked successfull",
      data: result,
    });
});

export const communicationController = {
  createChat,getChatById,allChats,deleteChat,
  sendMessage,getMessages,deleteMessages,
  blockUser,unblockUser
};