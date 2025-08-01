import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import ApiError from '../../../errors/ApiError';

const overviewController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { ...verifyData } = req.body;
  const result = await AdminService.overview(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Overview retrieved successfully",
    data: result,
  });
});

const usersController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { ...verifyData } = req.body;
  const result = await AdminService.users(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

const blockUser = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const id = req.params.id;
  if ( !id ) throw new ApiError(StatusCodes.BAD_REQUEST, "User id is required");
  
  const result = await AdminService.blockUser(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User blocked successfully",
    data: result,
  });
});

export const AdminController = { 
  overviewController,
  usersController,
  blockUser,
};
