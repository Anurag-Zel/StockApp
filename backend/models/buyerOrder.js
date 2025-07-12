import mongoose from 'mongoose';

const buyerOrderSchema = new mongoose.Schema({
  buyer_qty: Number,
  buyer_price: Number,
  isCompleted: { type: Boolean, default: false }
});

export default mongoose.model('BuyerOrder', buyerOrderSchema);