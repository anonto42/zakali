import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Types } from 'mongoose';

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid).select('-password -authentication -__v -updatedAt -createdAt -verified').lean().exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  };

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: any
) => {
  try {
    const { id } = user;
    const objid = new Types.ObjectId(id);
    const isExistUser = await User.findById(objid);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    //unlink file here
    if (payload.profileImage) {
      unlinkFile(isExistUser.profileImage);
    }
  
    const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
  
    return updateDoc;
    
  } catch (error: any) {

    unlinkFile(payload.profileImage);

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    )
  }
};

const uploadPhotosToDB = async (
  user: JwtPayload,
  images: string[]
)=> {
  try {
    const { id } = user;
    const objid = new Types.ObjectId(id);
    const isExistUser = await User.findById(objid);
    if (!isExistUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    isExistUser.photos.push(...images);
    await isExistUser.save();
  

    return true;
    
  } catch (error: any) {

    //unlink file here
    images.map((image) => {
      unlinkFile(image);
    })

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    )
  }
};

const enhanceProfile = async (
  payload: JwtPayload,
  user: IUser
) => {
  const { id } = payload;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findByIdAndUpdate(objid, user, { new: true }).select('-password -authentication -__v -updatedAt -createdAt -verified').lean().exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  };

  return isExistUser;
};

export const UserService = {
  getUserProfileFromDB,
  updateProfileToDB,
  uploadPhotosToDB,
  enhanceProfile,
};
