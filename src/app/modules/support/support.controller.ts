import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SupportService } from "./support.service";
import { Request, Response } from "express";


const createSupport = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await SupportService.createSupport(user, req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Support created successfully",
        data: result,
    });
});

const getSupports = catchAsync(async (req: Request, res: Response) => {
    const result = await SupportService.getSupports(req.user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Supports retrieved successfully",
        data: result,
    });
});

const getAllSupports = catchAsync(async (req: Request, res: Response) => {

    const result = await SupportService.getAllSupports(req.user);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Supports retrieved successfully",
        data: result,
    });
});

const giveASupport = catchAsync(async (req: Request, res: Response) => {
    
    const result = await SupportService.giveASupport(req.user, req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Support given successfully",
        data: result,
    });
});


export const SupportController = {
    createSupport,
    getSupports,
    getAllSupports,
    giveASupport
};
