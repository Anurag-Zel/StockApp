import CompletedOrder from "../models/completedOrder.js";
import BuyerOrder from "../models/buyerOrder.js";
import SellerOrder from "../models/sellerOrder.js";
import mongoose from 'mongoose';
import { decryptOrderData } from "../utils/decryptOrder.js";

// get all buyer
export const getAllBuyerOrders = async (req, res) => {
  try {
    const orders = await BuyerOrder.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all seller
export const getAllSellerOrders = async (req, res) => {
  try {
    const orders = await SellerOrder.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a new buyer order
export const addNewBuyerOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { encryptedData } = req.body;
    const { buyer_qty, buyer_price } = decryptOrderData(encryptedData);
    const newOrder = new BuyerOrder({ buyer_qty, buyer_price });
    await newOrder.save({ session });

    const matchedSellerOrder = await SellerOrder.findOne({
      seller_price: buyer_price,
    }).session(session);

    if (matchedSellerOrder) {
      const sellerQty = matchedSellerOrder.seller_qty;

      if (sellerQty === buyer_qty) {
        await CompletedOrder.create([{ price: buyer_price, qty: buyer_qty }], { session });
        await SellerOrder.findByIdAndDelete(matchedSellerOrder._id).session(session);
        await BuyerOrder.findByIdAndDelete(newOrder._id).session(session);
      } else if (sellerQty < buyer_qty) {
        await CompletedOrder.create([{ price: buyer_price, qty: sellerQty }], { session });
        await BuyerOrder.updateOne(
          { _id: newOrder._id },
          { $set: { buyer_qty: buyer_qty - sellerQty } },
          { session }
        );
        await SellerOrder.findByIdAndDelete(matchedSellerOrder._id).session(session);
      } else {
        await CompletedOrder.create([{ price: buyer_price, qty: buyer_qty }], { session });
        await SellerOrder.updateOne(
          { _id: matchedSellerOrder._id },
          { $set: { seller_qty: sellerQty - buyer_qty } },
          { session }
        );
        await BuyerOrder.findByIdAndDelete(newOrder._id).session(session);
      }
    // } else {
    //   // Use $set and upsert to create or update the buyer order correctly
    //   await BuyerOrder.updateOne(
    //     { buyer_price },
    //     { $set: { buyer_qty: newOrder.buyer_qty, buyer_price } },
    //     { upsert: true }
    //   );
    }
    await session.commitTransaction();
    res.sendStatus(201);
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).send("Server Error");
  } finally {
    session.endSession();
  }
};

// Add a new seller order
export const addNewSellerOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { encryptedData } = req.body;
    const { seller_qty, seller_price } = decryptOrderData(encryptedData);
    
    const newOrder = new SellerOrder({ seller_qty, seller_price });
    await newOrder.save({ session });

    const matchedBuyerOrder = await BuyerOrder.findOne({
      buyer_price: seller_price,
    }).session(session);

    if (matchedBuyerOrder) {
      const buyerQty = matchedBuyerOrder.buyer_qty;

      if (seller_qty === buyerQty) {
        await CompletedOrder.create([{ price: seller_price, qty: buyerQty }], { session });
        await BuyerOrder.findByIdAndDelete(matchedBuyerOrder._id).session(session);
        await SellerOrder.findByIdAndDelete(newOrder._id).session(session);
      } else if (seller_qty < buyerQty) {
        await CompletedOrder.create([{ price: seller_price, qty: seller_qty }], { session });
        await BuyerOrder.updateOne(
          { _id: matchedBuyerOrder._id },
          { $set: { buyer_qty: buyerQty - seller_qty } },
          { session }
        );
        await SellerOrder.findByIdAndDelete(newOrder._id).session(session);
      } else {
        await CompletedOrder.create([{ price: seller_price, qty: buyerQty }], { session });
        await BuyerOrder.findByIdAndDelete(matchedBuyerOrder._id).session(session);
        await SellerOrder.updateOne(
          { _id: newOrder._id },
          { $set: { seller_qty: seller_qty - buyerQty } },
          { session }
        );
      }
    // } else {
    //   await SellerOrder.updateOne(
    //     { seller_price },
    //     { $set: { seller_qty: newOrder.seller_qty, seller_price } },
    //     { upsert: true }
    //   );
    }
    await session.commitTransaction();
    res.sendStatus(201);
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).send("Server Error");
  } finally {
    session.endSession();
  }
};

// this is better code
export const getAllCompletedOrders = async (req, res) => {
  try {
    const completedData = await CompletedOrder.find({});
    res.json(completedData);
  } catch (error) {
    console.error(error);
  }
};

// export const getAllCompletedOrders = async (req, res) => {
//   try {
//     const buyerOrders = await BuyerOrder.find();
//     const sellerOrders = await SellerOrder.find();

//     const matchedOrders = [];
//     const completedOrders = [];
//     const buyerIdsToDelete = [];
//     const sellerIdsToDelete = [];

//     for (const buyerOrder of buyerOrders) {
//       for (const sellerOrder of sellerOrders) {
//         if (buyerOrder.buyer_price === sellerOrder.seller_price) {
//           matchedOrders.push({ buyerOrder, sellerOrder });

//           const completedOrder = await CompletedOrder.create({
//             price: sellerOrder.seller_price,
//             qty: sellerOrder.seller_qty,
//             sellerOrderId: sellerOrder._id,
//             buyerOrderId: buyerOrder._id,
//           });

//           completedOrders.push(completedOrder);
//           buyerIdsToDelete.push(buyerOrder._id);
//           sellerIdsToDelete.push(sellerOrder._id);

//           const sellerIndex = sellerOrders.findIndex((order) =>
//             order._id.equals(sellerOrder._id)
//           );
//           if (sellerIndex > -1) {
//             sellerOrders.splice(sellerIndex, 1);
//           }

//           break; // Move to the next buyerOrder
//         }
//       }
//     }

//     // Deleting matched orders from the database
//     if (buyerIdsToDelete.length > 0) {
//       await BuyerOrder.deleteMany({ _id: { $in: buyerIdsToDelete } });
//     }
//     if (sellerIdsToDelete.length > 0) {
//       await SellerOrder.deleteMany({ _id: { $in: sellerIdsToDelete } });
//     }

//     console.log("Completed Orders Array:", completedOrders);

//     try {
//       const completedMatchedOrders = await CompletedOrder.find();
//       res.status(200).json({
//         message: "Matching orders moved to Completed Order Table and removed from Pending Orders",
//         completedMatchedOrders
//       });
//     } catch (error) {
//       console.error("Error fetching completed orders:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }

//   } catch (error) {
//     console.error(
//       "Error moving matching orders to Completed Order Table:",
//       error
//     );
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
