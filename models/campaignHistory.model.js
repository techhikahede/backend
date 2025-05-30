import mongoose from "mongoose";

const campaignHistorySchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  segmentRules: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  audienceSize: {
    type: Number,
    required: true,
    min: 0,
  },
  sent: {
    type: Number,
    default: 0,
    min: 0,
  },
  failed: {
    type: Number,
    default: 0,
    min: 0,
  },
  successRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  status: {
    type: String,
    enum: ["planned", "active", "completed", "cancelled"],
    default: "planned",
  },
  customers: [
    {
      customerId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["delivered", "failed"],
        default: "delivered",
      },
    },
  ]
}, {
  timestamps: true,
});


const CampaignHistory = mongoose.model("CampaignHistory", campaignHistorySchema);

export default CampaignHistory;
