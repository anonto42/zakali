import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

const overview = async (payload: any) => {
  const { email, password } = payload;
  if (false) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return { };
};

export const AdminService = {
  overview,
};
