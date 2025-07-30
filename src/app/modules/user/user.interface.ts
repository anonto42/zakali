import { Model, Types } from 'mongoose';
import { GENDER, STATUS, USER_ROLES } from '../../../enums/user';

export type IUser = {
  name: string;
  email: string;
  phone: string;
  location: string;    
  gender: GENDER;
  age: number;
  country: string;
  peferredCountry: string;
  education: string;
  language: string;
  religion: string;
  marriedStatus: string;
  height: string;
  weight: string;
  hearColour: string;
  eyeColour: string;
  interestedIn: string;
  lookingFor: string;
  aboutMe: string;
  myChoice: string[]; 
  profileLocked: boolean;  
  accountVerification: {
    isVerified: boolean;
    document: string;
    samplePhotos: string[];
  };
  photos: string[]; 
  profileImage: string;      
  likedProfiles: Types.ObjectId[];
  windedProfiles: Types.ObjectId[]; 
  subscription: subscriptionType;
  password: string;
  role: USER_ROLES;
  status: STATUS;
  verified: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

type subscriptionType = {
  plan: string;
  startDate: Date;
  endDate: Date;
  status: string;
};

export type UserModal = {
  isValidUser(id: string):any;
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
