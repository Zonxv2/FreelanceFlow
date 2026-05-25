import { Router } from "express";
import { register, login } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
  });
});

export default router;