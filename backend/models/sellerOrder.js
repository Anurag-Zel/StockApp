// models/sellerOrder.js
import mongoose from 'mongoose';

const sellerOrderSchema = new mongoose.Schema({
  seller_qty: Number,
  seller_price: Number,
  isCompleted: { type: Boolean, default: false }
});

export default mongoose.model('SellerOrder', sellerOrderSchema);