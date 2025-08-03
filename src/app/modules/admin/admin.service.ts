import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { STATUS, USER_ROLES } from '../../../enums/user';
import { Types } from 'mongoose';
import { Revenue } from '../revenue/revenue.model';

const overview = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      'subscription.subscription': true,
      'subscription.subscriptionExpireAt': { $gt: new Date() },
    });
    const totalRevenue = await Revenue.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' }, 
        },
      },
    ]);
    const totalSubscriptions = await User.countDocuments({
      'subscription.subscription': true,
    });

    // Calculate User Engagement Percentage
    let userEngagementPercentage = 0;
    if (totalUsers > 0) {
      userEngagementPercentage = (activeUsers / totalUsers) * 100;
    }

    // Current Year
    const currentYear = new Date().getFullYear();

    // Yearly Revenue Data: Grouped by Month
    const revenueData = await Revenue.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $project: {
          amount: 1,
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // Format revenue data to ensure all months are present
    const revenueMap = new Map<number, number>();
    revenueData.forEach((entry) => {
      revenueMap.set(entry._id, entry.totalRevenue);
    });

    const formattedRevenueData = months.map((monthName, index) => ({
      month: monthName,
      revenue: revenueMap.get(index + 1) || 0,
    }));

    // User Growth Data: Grouped by Month
    const userGrowthData = await User.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
      },
      {
        $match: { year: currentYear },
      },
      {
        $group: {
          _id: '$month',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          newUsers: '$count',
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Format user growth data to ensure all months are present
    const formattedUserGrowthData = months.map((monthName, index) => {
      const entry = userGrowthData.find(data => data.month === index + 1);
      return {
        month: monthName,
        newUsers: entry ? entry.newUsers : 0,
      };
    });

    return {
      totalUsers,
      activeUsers,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0,
      totalSubscriptions,
      userEngagementPercentage: userEngagementPercentage.toFixed(2), // Include engagement percentage
      yearlyRevenueData: formattedRevenueData,
      userGrowth: formattedUserGrowthData,
    };
  } catch (error) {
    console.error("Error calculating overview data:", error);
    throw new Error("Failed to fetch overview data");
  }
};

const users = async () => {

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
