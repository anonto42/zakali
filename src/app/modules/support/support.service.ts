import { JwtPayload } from "jsonwebtoken";
import { Support, SUPPORT_STATUS } from "./support.model";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import ApiError from "../../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createSupport = async (
    payload: JwtPayload, body: any
) => {
    
    const user = payload.id;
    const objid = new Types.ObjectId(user);

    const isExistUser = await User.findById(objid);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    const { message } = body;

    const support = await Support.create({ user, message, status: SUPPORT_STATUS.PENDING });

    return support;
};

const getSupports = async (payload: JwtPayload) => {
    const { id } = payload;
    const objid = new Types.ObjectId(id);
    const isExistUser = await User.findById(objid);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    const supports = await Support.find({ user: objid }).lean().exec();
    return supports;
};

const getAllSupports = async (payload: JwtPayload) => {
    const { id } = payload;
    const objid = new Types.ObjectId(id);
    const isExistUser = await User.findById(objid);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    const supports = await Support.find().populate({ path: "user", select: "name email phone" }).lean().exec();
    return supports;
};

const giveASupport = async (payload: JwtPayload, body: any) => {
    
    const { id, replay, status } = body;
    const objId = new Types.ObjectId(id);
    const support = await Support.findById(objId);
    if (!support) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Support doesn't exist!");
    };

    support.status = status;
    support.replay = replay;
    await support.save();

    return support;
};

export const SupportService = {
    createSupport,
    getSupports,
    getAllSupports,
    giveASupport
};
