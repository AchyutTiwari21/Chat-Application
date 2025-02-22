import { Router } from "express";
import { 
    registerUser,
    loginUser,
    createRoom,
    getMessages,
    getRoomInfo
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);

router.route("/create-room").post(verifyJWT, createRoom);

router.route("/get-chats/:roomId").get(verifyJWT, getMessages);

router.route("/room/:slug").get(verifyJWT, getRoomInfo);

export default router;