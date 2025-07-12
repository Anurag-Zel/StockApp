import mongoose from 'mongoose';

const completedOrderSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  qty: { type: Number, required: true },

});

const CompletedOrder = mongoose.model('CompletedOrder', completedOrderSchema);

export default CompletedOrder;
