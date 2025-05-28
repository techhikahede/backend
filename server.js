import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import customerRoutes from "./routes/customer.route.js";
import orderRoutes from "./routes/order.route.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
