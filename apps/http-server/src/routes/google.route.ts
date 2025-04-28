import { Router } from "express";
import { googleCallback } from "../controllers/google.controller";

const router: Router = Router();

router.route("/callback").get(googleCallback);

export default router;