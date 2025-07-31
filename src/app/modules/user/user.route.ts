import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getUserProfile)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router
  .route('/')
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    fileUploadHandler(),
    UserController.uploadPhots
  );

router
  .route('/enhance-profile')
  .put(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(UserValidation.enhanceProfileZodSchema),
    UserController.enhanceProfile
  );

router
  .route("/send-verification-request")
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    fileUploadHandler(),
    UserController.sendVerificationRequest
  );

router
  .route("/liked-profile-list")
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getLikedProfileList)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(UserValidation.addToListSchema),
    UserController.likedProfileList
  );

router
  .route("/winked-profile-list")
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getWinkedList)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(UserValidation.addToListSchema),
    UserController.addToWinkedList
  );

router
  .route("/love-profile")
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getLovedProfileList)
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.USER),
    validateRequest(UserValidation.addToListSchema),
    UserController.loveProfile
  );

router
  .route("/profiles")
  .get(auth(USER_ROLES.ADMIN, USER_ROLES.USER), UserController.getProfiles);

export const UserRoutes = router;
