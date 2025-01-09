import express from "express";
import {
  signup,
  signin,
  signout,
  checkAuth,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/check", checkAuth);

export default router;
