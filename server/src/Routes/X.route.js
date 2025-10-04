import express from "express";
// controller
import ee from "../controllers/X.controller.js";
const router = express.Router();

router.get("/", ee);

export default router;
