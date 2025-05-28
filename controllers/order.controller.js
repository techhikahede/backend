import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { customerId, orderAmount, orderDate, items } = req.body;

    // Check if customer exists
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Create new order
    const order = new Order({
      customerId,
      orderAmount,
      orderDate,
      items,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      data: {
        orderNum: savedOrder.orderNum,
        customerId: savedOrder.customerId,
        orderAmount: savedOrder.orderAmount,
        orderDate: savedOrder.orderDate,
        items: savedOrder.items,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).lean();

    // Fetch customer names
    const customers = await Customer.find({}).lean();
    const customerMap = {};
    customers.forEach((cust) => {
      customerMap[cust.customerId] = cust.name;
    });

    // Attach customer name to each order
    const ordersWithCustomerNames = orders.map((order) => ({
      ...order,
      customerName: customerMap[order.customerId] || "Unknown",
    }));

    res.status(200).json({
      success: true,
      data: ordersWithCustomerNames,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
