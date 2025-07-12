import express from "express";
import { getPublicKey } from "../controllers/keyController.js";

const router = express.Router();

router.get("/publicKey", getPublicKey);

export default router;