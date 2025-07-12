import express from 'express';
import { addNewBuyerOrder, getAllBuyerOrders } from '../controllers/orderController.js';



const buyerRouter = express.Router();

// GET all buyer orders
buyerRouter.get('/getAllBuyer', getAllBuyerOrders);

// POST new buyer order
buyerRouter.post('/addNewBuyer', addNewBuyerOrder);

export default buyerRouter;