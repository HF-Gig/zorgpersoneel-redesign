import express from "express";
import { sayHello } from "../controllers/helloController.js";
import { sendContactEmail, sendZorgverlenerEmail } from "../controllers/emailController.js";

const router = express.Router();

router.get("/hello", sayHello);
router.post("/send-email", sendContactEmail);
router.post("/register-zorgverlener", sendZorgverlenerEmail);

export default router;
