import express from "express";
import {
  getUser,
  getCurrentUser,
} from "../controllers/index";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", getUser);
router.get("/me", getCurrentUser);

export default router;

