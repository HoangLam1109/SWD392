import { refreshToken, loginUser, logoutUser } from "../controllers/index";
import express from "express";
import authenticateUser from "../middlewares/authenticate.middleware";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", authenticateUser.refreshTokenValidation, refreshToken);

export default router;