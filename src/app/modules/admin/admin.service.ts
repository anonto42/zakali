import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { STATUS, USER_ROLES } from '../../../enums/user';
import { Types } from 'mongoose';

// TODO: Implement overview functionality
const overview = async (payload: any) => {
  // Implementation pending
  return {};
};

const users = async (payload: JwtPayload) => {

  const users = await User.find({ role: { $ne: USER_ROLES.ADMIN } })
    .select("-password -authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -photos -profileImage")
    .lean()
    .exec();

  return users;
};

const blockUser = async (id: string) => {

  const objid = new Types.ObjectId(id);
  const user = await User.findById(objid);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  } 

  const isBlocked = user.status == STATUS.BLOCKED ? STATUS.ACTIVE : STATUS.BLOCKED;
  
  user.status = isBlocked;
  await user.save();
  
  return user.status;
}; 

const boostedUsers = async (data: { limit: number, page: number }) => {
  const users = await User.find({
    "boost.boost": true, 
    // "boost.boostExpireAt": { $gt: new Date() } 
  })
    .populate("boost.boostPlan")
    .select("-authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -photos -profileImage -password -lovedProfiles -geoLocation")
    .limit(data.limit)
    .skip((data.page - 1) * data.limit)
    .lean()
    .exec();

  return users;
};

const subscriptions = async (
  data: { limit: number, page: number }
) => {

  const users = await User.find({
    "subscription.subscription": true, 
    // "subscription.subscriptionExpireAt": { $gt: new Date() } 
  })
    .populate("subscription.subscriptionPlan")
    .select("-authentication -__v -updatedAt -createdAt -verified -windedProfiles -likedProfiles -accountVerification -photos -profileImage -password -lovedProfiles -geoLocation")
    .limit(data.limit)
    .skip((data.page - 1) * data.limit)
    .lean()
    .exec();

  return users;
};


export const AdminService = {
  overview,
  users,
  blockUser,
  boostedUsers,
  subscriptions,
};
