import express from "express";
import { sayHello } from "../controllers/helloController.js";

const router = express.Router();

router.get("/hello", sayHello);

export default router;
