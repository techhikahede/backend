import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String, // e.g., "CUST001"
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
  visits: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastOrderDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Customer = mongoose.model("Customer", customerSchema);

// Utility to generate customerId like "CUST001", "CUST002", etc.
export const generateCustomerId = async () => {
  const lastCustomer = await Customer.findOne().sort({ createdAt: -1 });
  let lastId = "000";

  if (lastCustomer?.customerId) {
    lastId = lastCustomer.customerId.slice(4); // remove "CUST"
  }

  const nextId = String(parseInt(lastId) + 1).padStart(3, '0');
  return `CUST${nextId}`;
};

export default Customer;
