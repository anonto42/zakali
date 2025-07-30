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

export const UserController = { 
  getUserProfile, updateProfile, uploadPhots, enhanceProfile,

};
