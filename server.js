import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors"

import customerRoutes from "./routes/customer.route.js";
import orderRoutes from "./routes/order.route.js";
import campaignRoutes from "./routes/campaign.route.js";
import campaignHistoryRoutes from "./routes/campaignHistory.route.js";
import authRoutes from "./routes/auth.route.js";

import { protect } from "./middlewares/authMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.get("/", (req, res) => {
  res.send("API is running....");
});

// Auth route - no protection needed
app.use("/api/v1/auth", authRoutes);

// Protect your resource routes with the middleware
app.use("/api/v1/customers", protect, customerRoutes);
app.use("/api/v1/orders", protect, orderRoutes);
app.use("/api/v1/campaigns", protect, campaignRoutes);
app.use("/api/v1/campaignHistory", protect, campaignHistoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
