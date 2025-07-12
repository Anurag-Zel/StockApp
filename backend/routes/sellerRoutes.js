import express from 'express';
import { addNewSellerOrder, getAllSellerOrders } from '../controllers/orderController.js';


const sellerRouter = express.Router();

// GET all seller orders
sellerRouter.get('/getAllSeller', getAllSellerOrders);

// POST new seller order
sellerRouter.post('/addNewSeller', addNewSellerOrder);

export default sellerRouter;
