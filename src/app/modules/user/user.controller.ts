import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getMultipleFilesPath, getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import ApiError from '../../../errors/ApiError';
import { stripeWithKey } from '../../../util/stripe';
import { Types } from 'mongoose';
import { User } from './user.model';
import { Subscription } from '../subscription/subscription.model';
import { SUBSCRIPTION_TYPE } from '../subscription/subscription.interface';
import { Boost } from '../boost/boost.model';
import { PaymentSuccessPage, PyamentCancel, PyamentFailed } from '../../../shared/paymenTemplates';

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
  const result = await UserService.addToWinkedList(user, req.body.targetID);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile added to winked list successfully',
    data: result,
  });
});

const likedProfileList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.likedProfileList(user, req.body.targetID);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile added to liked list successfully',
    data: result,
  });
});

const getWinkedList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.getWinkedList(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Winked list retrieved successfully',
    data: result,
  });
});

const getLikedProfileList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.getLikedProfileList(user, req.body);

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

const loveProfile = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.loveProfile(user, req.body.targetID);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile added to loved list successfully',
    data: result,
  });
});

const getLovedProfileList = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.getLovedProfileList(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Loved list retrieved successfully',
    data: result,
  });
});

const searchProfiles = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.searchProfiles(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profiles retrieved successfully',
    data: result,
  });
});

const filterProfiles = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const result = await UserService.filterProfile(user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profiles filtered successfully',
    data: result,
  });
});

const getAProfile = catchAsync( async (req: Request | any, res: Response, next: NextFunction) => {
  const user = req.user;
  const userID = req.params.id;
  const result = await UserService.getAProfile(user, userID);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const boostProfile = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

  const user = req.user;

  const result = await UserService.boostProfile(user, req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile added to boost list successfully',
    data: result,
  });
});

const buySubscription = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  
  const user = req.user;

  const result = await UserService.buySubscription(user, req);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscription bought successfully',
    data: result,
  });
});

const paymentSuccess = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
 
  const { session_id } = req.query;
  if (!session_id) throw new ApiError(StatusCodes.BAD_REQUEST, "Session ID is required!");

  const session = await stripeWithKey.checkout.sessions.retrieve(session_id as string);
  if (!session) throw new ApiError(StatusCodes.NOT_FOUND, "Session was not found!");

  if (session.payment_status !== 'paid') {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Payment was not successful!");
  }
  const userId = session.metadata?.userID;

  const ObjId = new Types.ObjectId(userId);
  const user = await User.findById(ObjId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, "User was not found!");

  if( !user.lastPayment || user.lastPayment === "" ) {
    return res.send(PyamentFailed);
  }

  if( user.lastPayment != session_id ) {
    return res.send(PyamentFailed);
  }

  if ( session.metadata?.isSubscription === "true") {

    const subscriptionObjID = new Types.ObjectId(session.metadata?.plan_id);
    const subscription = await Subscription.findById(subscriptionObjID);
    if (!subscription) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Subscription was not found!");
    }

    const subscriptionDuration = SUBSCRIPTION_TYPE.MONTHLY == subscription.subscriptionType ? 30 : SUBSCRIPTION_TYPE.YEARLY == subscription.subscriptionType ? 365 : 7;
    
    user.subscription.subscription = true;
    user.subscription.subscriptionPlan = subscription._id;
    user.subscription.subscriptionExpireAt = new Date(Date.now() + subscriptionDuration * 24 * 60 * 60 * 1000);
    user.lastPayment = "";
    
    await user.save();

    return res.send(PaymentSuccessPage(subscription.price));
    
  } else if (session.metadata?.isBoost === "true") {
    
    const boostObjID = new Types.ObjectId(session.metadata?.plan_id);
    const boost = await Boost.findById(boostObjID);
    if (!boost) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Boost was not found!");
    }

    user.boost.boost = true;
    user.boost.boostPlan = boost._id;
    user.boost.boostExpireAt = new Date(Date.now() + boost.duration);
    user.lastPayment = "";
    
    await user.save();

    return res.send(PaymentSuccessPage(boost.price));
    
  }

});

const paymentFailure = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  return res.send(PyamentCancel);
});

export const UserController = { 
  getUserProfile, updateProfile, uploadPhots, enhanceProfile, 
  sendVerificationRequest,
  getLikedProfileList,
  getLovedProfileList,
  likedProfileList,
  addToWinkedList,
  searchProfiles,
  filterProfiles,
  getWinkedList,
  getProfiles,
  loveProfile,
  getAProfile,
  boostProfile,
  buySubscription,
  paymentSuccess,
  paymentFailure,
};
