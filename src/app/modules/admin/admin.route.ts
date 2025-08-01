import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router
  .route("/overview")  
  .get(
    auth(USER_ROLES.ADMIN),
    AdminController.overviewController
  );

router
  .route("/users")
  .get(
    auth(USER_ROLES.ADMIN),
    AdminController.usersController
  );

router
  .route("/users/:id")
  .patch(
    auth(USER_ROLES.ADMIN),
    AdminController.blockUser
  );

export const AdminRoutes = router;
