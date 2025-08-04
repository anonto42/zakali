import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { GENDER, STATUS, USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
  {
    boost: {
      boost: {
        type: Boolean,
        default: false,
      },
      boostExpireAt: {
        type: Date,
        default: null,
      },
      boostPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Boost',
        default: null,
      },
    },
    subscription: {
      subscription: {
        type: Boolean,
        default: false,
      },
      subscriptionExpireAt: {
        type: Date,
        default: null,
      },
      subscriptionPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null,
      },
    },
    lastPayment:{
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [ 
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
        'Please provide a valid email address' 
      ],
    },
    gender:{
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.MALE,
    },
    phone:{
      type: String,
      default: "",
    },
    location:{
      type: String,
      default: "",
    },  
    age:{
      type: Number,
      default: 0,
    },
    country:{
      type: String,
      default: "",
    },
    peferredCountry:{
      type: String,
      default: "",
    },
    education:{
      type: String,
      default: "",
    },
    language:{
      type: String,
      default: "",
    },
    religion:{
      type: String,
      default: "",
    },
    aboutMe:{
      type: String,
      default: "",
    },
    height:{
      type: String,
      default: "",
    },
    weight:{
      type: String,
      default: "",
    },
    accountVerification:{
      isVerified: {
        type: Boolean,
        default: false,
      },
      document: {
        type: String,
        default: "",
      },
      samplePhotos: {
        type: [String],
        default: [],
      },
    },
    photos: [{
      type: String,
      default: "",
    }],
    profileLocked: {
      type: Boolean,
      default: false,
    },
    likedProfiles: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    windedProfiles: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    lovedProfiles: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    eyeColour: {
      type: String,
      default: "",
    },
    hearColour: {
      type: String,
      default: "",
    },
    interestedIn: {
      type: String,
      default: "",
    },
    lookingFor: {
      type: String,
      default: "",
    },
    myChoice: {
      type: [String],
      default: [""],
    },
    marriedStatus:{
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      select: 0,
      minlength: 8,
    },
    profileImage: {
      type: String,
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    blockedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User'
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    authentication: {
      isResetPassword: {
        type: Boolean,
        default: false,
      },
      oneTimeCode: {
        type: Number,
        default: null,
      },
      expireAt: {
        type: Date,
        default: null,
      },
    },
    geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//Check user With validation in shourt and return the user
userSchema.statics.isValidUser = async (id: string) => {
  const isExist = await User  
                        .findById( id)
                        .select("-password -authentication -__v -updatedAt -createdAt")
                        .lean()
                        .exec();

  if (!isExist) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "User not found"
    );
  };

  if (!isExist.verified) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Your account was not verified!"
    )
  };

  if (isExist.status !== STATUS.ACTIVE) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      `You account was ${isExist.status}!`
    );
  };
  return isExist;
};

userSchema.pre('save', async function (next) {
  
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  next();
});

userSchema.index({ geoLocation: '2dsphere' });

export const User = model<IUser, UserModal>('User', userSchema);
