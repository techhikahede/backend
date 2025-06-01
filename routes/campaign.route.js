import express from "express";
import {
  createCampaign,
  previewCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  parseNaturalLanguageByGemini,
} from "../controllers/campaign.controller.js";

const router = express.Router();

router.post("/create", createCampaign);
router.post("/preview", previewCampaign);
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;