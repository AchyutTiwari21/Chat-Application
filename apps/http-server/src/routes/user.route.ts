import { Router } from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    createRoom,
    getMessages,
    getRoomInfo
} from "../controllers/user.controller";
import { googleLoginUser } from "../controllers/google.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/loginWithGoogle").get(googleLoginUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/get-currentUser").get(verifyJWT, getCurrentUser);

router.route("/create-room").post(verifyJWT, createRoom);

router.route("/get-chats/:roomId").get(verifyJWT, getMessages);

router.route("/room/:slug").get(verifyJWT, getRoomInfo);

export default router;