import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { GENDER, STATUS, USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
  {
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
      required: true,
    },
    location:{
      type: String,
      required: true,
    },  
    age:{
      type: Number,
      required: true,
    },
    country:{
      type: String,
      required: true,
    },
    peferredCountry:{
      type: String,
      required: true,
    },
    education:{
      type: String,
      required: true,
    },
    language:{
      type: String,
      required: true,
    },
    religion:{
      type: String,
      required: true,
    },
    aboutMe:{
      type: String,
      required: true,
    },
    height:{
      type: String,
      required: true,
    },
    weight:{
      type: String,
      required: true,
    },
    accountVerification:{
      isVerified: {
        type: Boolean,
        default: false,
      },
      document: {
        type: String,
        default: null,
      },
      samplePhotos: [{
        type: String,
        default: null,
      }],
    },
    photos: [{
      type: String,
      default: null,
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
    eyeColour: {
      type: String,
      default: null,
    },
    hearColour: {
      type: String,
      default: null,
    },
    interestedIn: {
      type: String,
      default: null,
    },
    lookingFor: {
      type: String,
      default: null,
    },
    myChoice: {
      type: [String],
      default: null,
    },
    marriedStatus:{
      type: String,
      default: null,
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

//check user
userSchema.pre('save', async function (next) {
  //check user
  const isExist = await User.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
  }

  //password hash
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModal>('User', userSchema);
