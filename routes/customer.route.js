import express from "express";
import {
  getAllCustomers,
  createCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/all", getAllCustomers);
router.post("/create", createCustomer);

export default router;