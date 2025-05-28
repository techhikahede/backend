import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  field: {
    type: String,
    required: [true, "Field is required in targeting rule"],
    trim: true,
  },
  operator: {
    type: String,
    required: [true, "Operator is required in targeting rule"],
    enum: ["equals", "not_equals", "greater_than", "less_than", "contains", "not_contains", "in", "not_in"], // Extend as needed
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "Value is required in targeting rule"],
  }
}, { _id: false });

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
      validator: function (value) {
        return !value || value > this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  targetingRules: {
    type: [ruleSchema],
    default: [],
    validate: {
      validator: function (rules) {
        return Array.isArray(rules);
      },
      message: "Targeting rules must be an array",
    }
  },
  targetCustomers: [{
    type: String, // Reference by customer ID (like "CUST001")
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
      validator: function (value) {
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
  timestamps: true, // Adds createdAt and updatedAt
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
