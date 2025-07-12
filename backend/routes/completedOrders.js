import express from 'express';
import { getAllCompletedOrders } from '../controllers/orderController.js';


const router = express.Router();

router.get('/completed', getAllCompletedOrders);

export default router;
