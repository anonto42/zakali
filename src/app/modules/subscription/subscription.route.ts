import { Router } from "express";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import { SubscriptionController } from "./subscription.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createSubscriptionPlanZodSchema, deleteSubscriptionPlanZodSchema, updateSubscriptionPlanZodSchema } from "./subscription.validation";


const route = Router()

route 
    .route("/")
    .get(
        auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        SubscriptionController.getSubscriptionPlans
    )
    .post(
        auth(USER_ROLES.ADMIN),
        validateRequest(createSubscriptionPlanZodSchema),
        SubscriptionController.createSubscriptionPlan
    )
    .put(
        auth(USER_ROLES.ADMIN),
        validateRequest(updateSubscriptionPlanZodSchema),
        SubscriptionController.updateSubscriptionPlan
    )
    .delete(
        auth(USER_ROLES.ADMIN),
        validateRequest(deleteSubscriptionPlanZodSchema),
        SubscriptionController.deleteSubscriptionPlan
    )

export const SubscriptionRoutes = route