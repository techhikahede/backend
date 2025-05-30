import mongoose from "mongoose";

const communicationLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Campaign",
  },
  customersStatus: [
    {
      customerId: {
        type: String,
        required: true,
        ref: "Customer",
      },
      status: {
        type: String,
        enum: ["delivered", "failed"],
        required: true,
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});



const CommunicationLog = mongoose.model("CommunicationLog", communicationLogSchema);

export default CommunicationLog;