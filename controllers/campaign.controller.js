import Campaign from "../models/campaign.model.js";
import Customer from "../models/customer.model.js";
import { generateSequence } from "../utils/generateSequence.js";

// Helper: Build MongoDB filter from rules
const buildMongoQueryFromRules = (rules = []) => {
  const query = {};

  for (const rule of rules) {
    const { field, operator, value } = rule;

    switch (operator) {
      case "equals":
        query[field] = value;
        break;
      case "not_equals":
        query[field] = { $ne: value };
        break;
      case "greater_than":
        query[field] = { $gt: value };
        break;
      case "less_than":
        query[field] = { $lt: value };
        break;
      case "contains":
        query[field] = { $regex: value, $options: "i" };
        break;
      case "not_contains":
        query[field] = { $not: { $regex: value, $options: "i" } };
        break;
      case "in":
        query[field] = { $in: value };
        break;
      case "not_in":
        query[field] = { $nin: value };
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  return query;
};

// 📤 Preview Matching Customers
export const previewCampaign = async (req, res) => {
  try {
    const { rules = [] } = req.body;

    const filter = buildMongoQueryFromRules(rules);
    const customers = await Customer.find(filter);

    return res.status(200).json({
      success: true,
      matchedCount: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Preview error:", error);
    return res.status(500).json({
      success: false,
      message: "Error previewing campaign audience",
    });
  }
};

// 🧨 Create Campaign
export const createCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      budget,
      rules = [],
    } = req.body;

    if (!rules.length) {
      return res.status(400).json({
        success: false,
        message: "Targeting rules are required to create a campaign",
      });
    }

    const campaignId = await generateSequence("campaign_seq");

    const filter = buildMongoQueryFromRules(rules);
    const matchingCustomers = await Customer.find(filter, { customerId: 1 });

    const targetCustomers = matchingCustomers.map((c) => c.customerId);

    const newCampaign = new Campaign({
      campaignId: `CAMP${campaignId.toString().padStart(3, "0")}`,
      name,
      description,
      startDate,
      endDate,
      targetingRules: rules,
      budget,
      targetCustomers,
      history: [
        {
          event: "Campaign Created",
          details: `Targeted ${targetCustomers.length} customers based on rules`,
        },
      ],
    });

    await newCampaign.save();

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create campaign",
    });
  }
};

// 🧠 Get All Campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.error("Get all campaigns error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
    });
  }
};

// 📄 Get Campaign By ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    return res.status(200).json({ success: true, campaign });
  } catch (error) {
    console.error("Get campaign by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaign",
    });
  }
};

// ✏ Update Campaign
export const updateCampaign = async (req, res) => {
  try {
    const { rules = [], ...updateFields } = req.body;

    if (rules.length > 0) {
      const filter = buildMongoQueryFromRules(rules);
      const matchingCustomers = await Customer.find(filter, { customerId: 1 });
      updateFields.targetCustomers = matchingCustomers.map((c) => c.customerId);
      updateFields.targetingRules = rules;
    }

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...updateFields, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      campaign: updated,
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating campaign",
    });
  }
};

// ❌ Delete Campaign
export const deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    return res.status(200).json({ success: true, message: "Campaign deleted" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting campaign",
    });
  }
};

