import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    default: "",
    maxlength: 1000,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        // endDate should be after startDate if provided
        return !value || value > this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  targetCustomers: [{
    type: String, // Assuming your customerId is string like "CUST001"
    ref: "Customer",
  }],
  budget: {
    type: Number,
    default: 0,
    min: [0, "Budget cannot be negative"],
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, "Spent amount cannot be negative"],
    validate: {
      validator: function(value) {
        // spent cannot exceed budget
        return value <= this.budget;
      },
      message: "Spent amount cannot exceed budget",
    },
  },
  status: {
    type: String,
    enum: ["planned", "active", "completed", "cancelled"],
    default: "planned",
  },
  history: [{
    date: {
      type: Date,
      default: Date.now,
    },
    event: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    details: {
      type: String,
      default: "",
      maxlength: 1000,
    }
  }],
}, {
  timestamps: true, // auto creates createdAt and updatedAt
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
