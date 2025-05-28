import Customer, { generateCustomerId } from "../models/customer.model.js";

// GET all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}, {
      _id: 0,
      customerId: 1,
      name: 1,
      email: 1,
      totalSpent: 1,
      visits: 1,
      lastOrderDate: 1,
    }).sort({ customerId: 1 });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};

// CREATE a new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, totalSpent = 0, visits = 0, lastOrderDate = null } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check for duplicate email
    const existing = await Customer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Customer with this email already exists" });
    }

    const newId = await generateCustomerId();

    const newCustomer = new Customer({
      customerId: newId,
      name,
      email: email.toLowerCase(),
      totalSpent,
      visits,
      lastOrderDate,
    });

    const saved = await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer: {
        customerId: saved.customerId,
        name: saved.name,
        email: saved.email,
        totalSpent: saved.totalSpent,
        visits: saved.visits,
        lastOrderDate: saved.lastOrderDate,
      },
    });
  } catch (error) {
    console.error("Error creating customer:", error.message);
    res.status(500).json({ error: "Failed to create customer" });
  }
};
