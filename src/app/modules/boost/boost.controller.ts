import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BoostService } from "./boost.service";

const getBoostPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await BoostService.getBoostPlans();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Boost plans retrieved successfully",
        data: result,
    });
});

const createBoostPlan = catchAsync(async (req: Request, res: Response) => {
    const result = await BoostService.createBoostPlan(req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Boost plan created successfully",
        data: result,
    });
});

const updateBoostPlan = catchAsync(async (req: Request, res: Response) => {
    const result = await BoostService.updateBoostPlan(req.body.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Boost plan updated successfully",
        data: result,
    });
});

export const BoostController = {
    createBoostPlan,
    updateBoostPlan,
    getBoostPlans,
};