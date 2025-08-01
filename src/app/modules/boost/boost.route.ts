import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import validateRequest from "../../middlewares/validateRequest";
import { createBoostPlanZodSchema, updateBoostPlanZodSchema } from "./boost.validatior";
import { BoostController } from "./boost.controller";


const router = Router();

router
  .route("/")
  .get(
    auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
    BoostController.getBoostPlans
  )
  .post(
    auth( USER_ROLES.ADMIN ),
    validateRequest(createBoostPlanZodSchema),
    BoostController.createBoostPlan
  )
  .put(
    auth( USER_ROLES.ADMIN ),
    validateRequest(updateBoostPlanZodSchema),
    BoostController.updateBoostPlan
  )



export const BoostRoutes = router;