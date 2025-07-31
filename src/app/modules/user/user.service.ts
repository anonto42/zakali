import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES, VALIDATION_STATUS } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model';
import { Types } from 'mongoose';
import Validation from '../validation/validation.model';

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

const sendVerificationRequest = async (
  payload: JwtPayload,
  data: any
) => {
  try {

    const objID = new Types.ObjectId(payload.id);
    const user = await User.findById(objID);
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
  
    if (user.accountVerification.isVerified) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User already verified!");
    }
  
    if (!data.image || !data.doc) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Image and doc are required!");
    }

    if (!Array.isArray(data.image)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Image data must be an array of strings");
    }
    
    const isExistValidation = await Validation.findOne({ user: user._id });
    if (isExistValidation) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "User already sent verification request!");
    }

    user.accountVerification.document = "";
    user.accountVerification.samplePhotos = [];
  
    user.accountVerification.document = data.doc;
    user.accountVerification.samplePhotos.push(...data.image);
    
    await user.save();
    
    const validation = await Validation.create({
      user: user._id,
      image: data.image,
      doc: data.doc,
      status: VALIDATION_STATUS.PENDING,
    })
  
    return validation;
    
  } catch (error: any) {
    unlinkFile(data.doc);
    data.image.map((image: string) => {
      unlinkFile(image);
    });
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message
    )
  }

};

const addToWinkedList = async (
  payload: JwtPayload,
  ID: string
) => {
  const { id } = payload;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const likedUser = new Types.ObjectId(ID);
  const isExistLikedUser = await User.findById(likedUser);
  if (!isExistLikedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Liked user doesn't exist!");
  };

  if (isExistUser.windedProfiles.includes(likedUser._id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already added to winked list!");
  }
  
  isExistUser.windedProfiles.push(likedUser._id);
  await isExistUser.save();

  return true;
};

const likedProfileList = async (
  payload: JwtPayload,
  ID: string
) => {
  const { id } = payload;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const likedUser = new Types.ObjectId(ID);
  const isExistLikedUser = await User.findById(likedUser);
  if (!isExistLikedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Liked user doesn't exist!");
  };

  if (isExistUser.likedProfiles.includes(likedUser._id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already added to liked list!");
  }

  isExistUser.likedProfiles.push(likedUser._id);
  await isExistUser.save();

  return true;
};

const getWinkedList = async (payload: JwtPayload, body: any) => {
  const { id } = payload;
  const { page, limit } = body;

  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid)
    .populate('windedProfiles') 
    .lean()
    .exec();

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedWinkedProfiles = isExistUser.windedProfiles.slice(startIndex, endIndex);

  return paginatedWinkedProfiles;
};

const getLikedProfileList = async (
  payload: JwtPayload,
  body: any
) => {
  const { id } = payload;
  const { page, limit } = body;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid)
    .populate('likedProfiles') 
    .lean()
    .exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedLikedProfiles = isExistUser.likedProfiles.slice(startIndex, endIndex);

  return paginatedLikedProfiles;
};

const getProfiles = async (
  payload: JwtPayload,
  pagination: { page: number, limit: number }
) => {
  const { id } = payload;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid).populate('windedProfiles').lean().exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const profiles = await User.find({ role: { $ne: USER_ROLES.ADMIN } })
  .select("-password -authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -photos -profileImage")
  .limit(pagination.limit)
  .skip((pagination.page - 1) * pagination.limit)
  .lean()
  .exec();

  return profiles;
};

const loveProfile = async (
  payload: JwtPayload,
  ID: string
) => {
  const { id } = payload;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const likedUser = new Types.ObjectId(ID);
  const isExistLikedUser = await User.findById(likedUser);
  if (!isExistLikedUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Liked user doesn't exist!");
  };

  if (isExistUser.lovedProfiles.includes(likedUser._id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already added to loved list!");
  }

  isExistUser.lovedProfiles.push(likedUser._id);
  await isExistUser.save();

  return true;
};

const getLovedProfileList = async (
  payload: JwtPayload,
  body: any
) => {
  const { id } = payload;
  const { page, limit } = body;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid).populate('lovedProfiles').lean().exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedLovedProfiles = isExistUser.lovedProfiles.slice(startIndex, endIndex);

  return paginatedLovedProfiles;
};

const searchProfiles = async (payload: JwtPayload, body: any) => {
  const { page, limit, searchQuery } = body; 

  const { id } = payload;

  const usernameCondition = searchQuery 
    ? { name: { $regex: searchQuery, $options: 'i' } } 
    : {};

  const profiles = await User.find(usernameCondition) 
    .select("-password -authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -photos -profileImage") 
    .limit(limit) 
    .skip((page - 1) * limit) 
    .lean()
    .exec();

  if (!profiles || profiles.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No profiles found matching your search criteria.");
  }

  return profiles;
};

const filterProfile = async (payload: JwtPayload, body: any) => {
  const { page, limit } = body;
  const { id } = payload;

  const user = await User.findById(id).select('geoLocation');

  if (!user || !user.geoLocation) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Your location is not available.");
  }

  const { coordinates } = user.geoLocation;
  const userLatitude = coordinates[1];
  const userLongitude = coordinates[0];

  const filterConditions: any = {};

  Object.keys(body).forEach(key => {
    switch (key) {
      case 'age_from':
        filterConditions.age = { $gte: body.age_from };
        break;
      case 'age_to':
        filterConditions.age = { ...filterConditions.age, $lte: body.age_to };
        break;
      case 'gender':
        filterConditions.gender = body.gender;
        break;
      case 'interestedIn':
        filterConditions.interestedIn = body.interestedIn;
        break;
      case 'lookingFor':
        filterConditions.lookingFor = body.lookingFor;
        break;
      case 'preferredCountry':
        filterConditions.country = body.preferredCountry;
        break;
      case 'education':
        filterConditions.education = body.education;
        break;
      case 'language':
        filterConditions.language = body.language;
        break;
      case 'religion':
        filterConditions.religion = body.religion;
        break;
      case 'marriedStatus':
        filterConditions.marriedStatus = body.marriedStatus;
        break;
      case 'height':
        filterConditions.height = body.height;
        break;
      case 'weight':
        filterConditions.weight = body.weight;
        break;
      case 'hearColour':
        filterConditions.hearColour = body.hearColour;
        break;
      case 'eyeColour':
        filterConditions.eyeColour = body.eyeColour;
        break;
      default:
        break;
    }
  });
  
  if (body.distance) {
    const maxDistance = body.distance * 1000;

    filterConditions.geoLocation = {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [userLongitude, userLatitude],
        },
        $maxDistance: maxDistance,
      },
    };
  }

  const profiles = await User.find(filterConditions)
    .select("-password -authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -photos -profileImage")
    .limit(limit) 
    .skip((page - 1) * limit) 
    .lean()
    .exec();

  if (!profiles || profiles.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No profiles found matching your search criteria.");
  }

  return profiles;
};

const getAProfile = async (
  payload: JwtPayload,
  ID: string
) => {
  const { id } = payload;
  const objid = new Types.ObjectId(id);
  const isExistUser = await User.findById(objid).select('-password -authentication -__v -updatedAt -createdAt -verified').lean().exec();
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const profileID = new Types.ObjectId(ID);
  const profile = await User.findById(profileID).select('-password -authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -geoLocation').lean().exec();
  if (!profile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Profile doesn't exist!");
  }

  return profile;
};

export const UserService = {
  sendVerificationRequest,
  getUserProfileFromDB,
  getLovedProfileList,
  getLikedProfileList,
  updateProfileToDB,
  uploadPhotosToDB,
  likedProfileList,
  addToWinkedList,
  enhanceProfile,
  searchProfiles,
  filterProfile,
  getWinkedList,
  loveProfile,
  getProfiles,
  getAProfile,
};
