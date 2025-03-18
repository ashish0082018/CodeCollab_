import express from "express";
import { askai } from "../controllers/codeai.js";
const router=express.Router();

router.route("/askai").post(askai)

export default router