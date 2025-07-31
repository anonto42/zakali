import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getUserProfile = catchAsync(async (req: Request | any, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

const uploadPhots = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  let image = getMultipleFilesPath(req.files, 'image');

  const result = await UserService.uploadPhotosToDB(user, image as string[]);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Photos uploaded successfully',
    data: result,
  });
});

const updateProfile = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const result = await UserService.updateProfileToDB(user, {profileImage: image});

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const enhanceProfile = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.enhanceProfile(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile enhanced successfully',
    data: result,
  });
});

const sendVerificationRequest = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;

  const image = getMultipleFilesPath(req.files, 'image');
  const doc = getSingleFilePath(req.files, 'doc');

  const data = { image, doc };

  const result = await UserService.sendVerificationRequest(user, data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Verification request sent successfully',
    data: result,
  });
});

const addToWinkedList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.addToWinkedList(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile added to winked list successfully',
    data: result,
  });
});

const likedProfileList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.likedProfileList(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile added to liked list successfully',
    data: result,
  });
});

const getWinkedList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.getWinkedList(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Winked list retrieved successfully',
    data: result,
  });
});

const getLikedProfileList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.getLikedProfileList(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Liked list retrieved successfully',
    data: result,
  });
});

const getProfiles = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.getProfiles(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profiles retrieved successfully',
    data: result,
  });
});

export const UserController = { 
  getUserProfile, updateProfile, uploadPhots, enhanceProfile, 
  sendVerificationRequest,
  getLikedProfileList,
  likedProfileList,
  addToWinkedList,
  getWinkedList,
  getProfiles,
};
