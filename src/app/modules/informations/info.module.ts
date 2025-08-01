import { Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { INFORMATION_TYPE, InformationModal } from "./information.model";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import validateRequest from "../../middlewares/validateRequest";


const router = Router();


// Services

// Post

const createAboutUs = async (req: Request, res: Response) => {
    const result = await InformationModal.create({type: INFORMATION_TYPE.ABOUT_US, ...req.body})

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "About us created successfully",
        data: result,
    });
};

const createPrivacyPolicy = async (req: Request, res: Response) => {
    const result = await InformationModal.create({type: INFORMATION_TYPE.PRIVACY_POLICY, ...req.body})

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Privacy policy created successfully",
        data: result,
    });
};

const createTermsOfService = async (req: Request, res: Response) => {
    const result = await InformationModal.create({type: INFORMATION_TYPE.TERMS_OF_SERVICE, ...req.body})

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Terms of service created successfully",
        data: result,
    });
};

// Get

const getAboutUs = async (req: Request, res: Response) => {
    const result = await InformationModal.findOne({type: INFORMATION_TYPE.ABOUT_US})

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "About us retrieved successfully",
        data: result,
    });
};

const getPrivacyPolicy = async (req: Request, res: Response) => {
    const result = await InformationModal.findOne({type: INFORMATION_TYPE.PRIVACY_POLICY})

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Privacy policy retrieved successfully",
        data: result,
    });
};

const getTermsOfService = async (req: Request, res: Response) => {
    const result = await InformationModal.findOne({type: INFORMATION_TYPE.TERMS_OF_SERVICE})

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Terms of service retrieved successfully",
        data: result,
    });
};

// Patch

const updateAboutUs = async (req: Request, res: Response) => {
    const result = await InformationModal.findOneAndUpdate({type: INFORMATION_TYPE.ABOUT_US}, req.body, { new: true })

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "About us updated successfully",
        data: result,
    });
};

const updatePrivacyPolicy = async (req: Request, res: Response) => {
    const result = await InformationModal.findOneAndUpdate({type: INFORMATION_TYPE.PRIVACY_POLICY}, req.body, { new: true })

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Privacy policy updated successfully",
        data: result,
    });
};

const updateTermsOfService = async (req: Request, res: Response) => {
    const result = await InformationModal.findOneAndUpdate({type: INFORMATION_TYPE.TERMS_OF_SERVICE}, req.body, { new: true })

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Terms of service updated successfully",
        data: result,
    });
};

// Validator
const zodValidation = z.object({
    body: z.object({
        title: z.string({ required_error: "Title is required" }),
        content: z.string({ required_error: "Content is required" }),
    })
})


router
    .route("/about-us")
    .get(
        auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        getAboutUs
    )
    .post(
        auth(USER_ROLES.ADMIN),
        validateRequest(zodValidation),
        createAboutUs
    )
    .patch(
        auth(USER_ROLES.ADMIN),
        validateRequest(zodValidation),
        updateAboutUs
    );

router
    .route("/privacy-policy")
    .get(
        auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        getPrivacyPolicy
    )
    .post(
        auth(USER_ROLES.ADMIN),
        validateRequest(zodValidation),
        createPrivacyPolicy
    )
    .patch(
        auth(USER_ROLES.ADMIN),
        updatePrivacyPolicy
    );

router 
    .route("/terms-service")
    .get(
        auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        getTermsOfService
    )
    .post(
        auth(USER_ROLES.ADMIN),
        validateRequest(zodValidation),
        createTermsOfService
    )
    .patch(
        auth(USER_ROLES.ADMIN),
        validateRequest(zodValidation),
        updateTermsOfService
    );

export const InformationRoutes = router;
