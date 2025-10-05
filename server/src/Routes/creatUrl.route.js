import express from "express";
// controller
import creatshortUrl from "../controllers/shorturlCreate.controller.js";
const router = express.Router();

router.post("/", creatshortUrl);

export default router;
