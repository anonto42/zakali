import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SubscriptionService } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


const getSubscriptionPlans = catchAsync(async (req: Request, res:Response, next:NextFunction) => {

    const result = await SubscriptionService.getSubscriptionPlans();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Subscription plans retrieved successfully",
        data: result,
    });
});


const createSubscriptionPlan = catchAsync(async (req: Request, res:Response, next:NextFunction) => {

    const result = await SubscriptionService.createSubscriptionPlan(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Subscription plan created successfully",
        data: result,
    });
});

const updateSubscriptionPlan = catchAsync(async (req: Request, res:Response, next:NextFunction) => {

    const result = await SubscriptionService.updateSubscriptionPlan(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Subscription plan updated successfully",
        data: result,
    });
});

const deleteSubscriptionPlan = catchAsync(async (req: Request, res:Response, next:NextFunction) => {

    const result = await SubscriptionService.deleteSubscriptionPlan(req.body);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Subscription plan deleted successfully",
        data: result,
    });
});

export const SubscriptionController = {
    getSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
};
