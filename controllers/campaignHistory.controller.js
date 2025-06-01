import Campaign from "../models/campaign.model.js";
import CommunicationLog from "../models/communicationLog.model.js";
import Customer from "../models/customer.model.js";

// GET /api/campaigns/history?includeCustomers=true
export const getCampaignHistory = async (req, res) => {
  try {
    // Check if client requested to include full customer data
    const includeCustomers = req.query.includeCustomers === "true";

    // Get all campaigns sorted by creation date (newest first)
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    

    // Build the campaign history array
    // ...
    let totalSentEmail = 0;
    let totalAudienceSize = 0;
    let totalFailed = 0;
const history = await Promise.all(
  campaigns.map(async (campaign) => {
    
    const log = await CommunicationLog.findOne({ campaignId: campaign._id });

    const total = log?.customersStatus?.length || 0;
    const failed = log?.customersStatus?.filter(c => c.status === "failed").length || 0;
    const sent = total;
    const success = sent - failed;
    const successRate = sent > 0 ? ((success / sent) * 100).toFixed(2) + "%" : "0%";

    let customers = [];
    if (includeCustomers && log?.customersStatus?.length) {
  const customerIds = log.customersStatus.map(c => c.customerId);

  // Fetch full customer data for the IDs
  const customerDataMap = await Customer.find({ customerId: { $in: customerIds } })
    .then(docs =>
      docs.reduce((acc, doc) => {
        acc[doc.customerId] = doc;
        return acc;
      }, {})
    );

  // Merge customer info with delivery status from CommunicationLog
  customers = log.customersStatus.map(({ customerId, status, sentAt }) => {
    const customer = customerDataMap[customerId] || {};
    return {
      ...customer._doc,  // contains name, email, etc.
      deliveryStatus: status,
      sentAt,
    };
  });
}


    totalSentEmail += sent;
    totalAudienceSize += campaign.targetCustomers.length;
    totalFailed += failed;

    return {
      campaignId: campaign.campaignId,
      name: campaign.name,
      rules: campaign.targetingRules,
      audienceSize: campaign.targetCustomers.length,
      sent,
      failed,
      successRate,
      status: campaign.status,
      createdAt: campaign.createdAt,
      customers: includeCustomers ? customers : undefined,  
    };
  })
);
// ...


    // Send the full campaign history
    res.status(200).json({
      message:"Fetched all campaign successfully",
      history,
      totalSize:history.length,
      totalSent : totalSentEmail,
      totalAudienceSize,
      successRate: (1 - (totalAudienceSize - totalFailed)/totalAudienceSize )*100
    });

  } catch (error) {
    console.error("Error fetching campaign history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
