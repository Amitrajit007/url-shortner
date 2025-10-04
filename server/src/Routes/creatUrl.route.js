import express from "express";
// controller
import creatshortUrl from "../controllers/shorturlCreate.controller.js";
const router = express.Router();

router.get("/", creatshortUrl);

export default router;
