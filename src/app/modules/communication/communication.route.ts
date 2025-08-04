import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { communicationController } from "./communication.controller";
import validateRequest from "../../middlewares/validateRequest";
import { communicationValidation } from "./communication.validation";
import fileUploadHandler from "../../middlewares/fileUploadHandler";

const router = Router();

router
    .route("/message")
    .get(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.getMessages
    )
    .post(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        fileUploadHandler(),
        validateRequest(communicationValidation.sendMessage),
        communicationController.sendMessage
    )
    .delete(
        auth( 
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.deleteMessages
    )

router
    .route("/chat")
    .get(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.allChats
    )
    .post(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.createChat
    )

router
    .route("/chat/:id")
    .get(
        auth(
            USER_ROLES.ADMIN, 
            USER_ROLES.USER
        ),
        communicationController.getChatById
    )
    .delete(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.deleteChat
    )

router
    .route("/block-user/:id")
    .put(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.blockUser
    )
    .patch(
        auth(
            USER_ROLES.ADMIN,
            USER_ROLES.USER
        ),
        communicationController.unblockUser
    )
    




export const CommunicationRoutes = router;