import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

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

export const AdminController = { 
  overviewController,
};
