import express from "express";
// controller
import redirection from "../controllers/redirect.controller.js";
const router = express.Router({ mergeParams: true });

router.get("/", redirection);

export default router;
