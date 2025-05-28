import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      ref: "Customer",
    },
    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    items: {
      type: [String],
      required: true,
    },
    orderNum: {
      type: Number,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-increment orderNum starting at 1
orderSchema.plugin(AutoIncrement, {
  id: "order_seq",
  inc_field: "orderNum",
  start_seq: 1,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
