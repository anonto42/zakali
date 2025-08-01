import { Router } from "express";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SupportController } from "./support.controller";
import { SupportValidation } from "./support.validation";


const router = Router();

router
    .route("/")
    .get(
        auth( USER_ROLES.ADMIN, USER_ROLES.USER ),
        SupportController.getSupports
    )
    .post(
        auth(USER_ROLES.ADMIN, USER_ROLES.USER),
        validateRequest(SupportValidation.createSupportZodSchema),
        SupportController.createSupport
    )

router
    .route("/admin")
    .get(
        auth(USER_ROLES.ADMIN),
        SupportController.getAllSupports
    )
    .patch(
        auth(USER_ROLES.ADMIN),
        validateRequest(SupportValidation.giveASupportZodSchema),
        SupportController.giveASupport
    )


export const SupportRoutes = router;