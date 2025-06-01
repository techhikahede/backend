import express from "express";
import { getCampaignHistory } from "../controllers/campaignHistory.controller.js";
const router = express.Router();

router.get("/all", getCampaignHistory);

export default router;