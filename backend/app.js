import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import completedOrders from "./routes/completedOrders.js";

import buyerRouter from "./routes/buyerRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import publicKeyRoutes from "./routes/orderRoutes.js";

// Create an instance of express
export const app = express();

// Configure dotenv to load environment variables
dotenv.config({
  path: "./config/.env",
});


// Middleware
app.use(express.json());
app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.send("Nice working.");
});

// Cross-Origin Resource Sharing (CORS) configuration
app.use(
  cors({
    origin: 'https://stock-app-lime-one.vercel.app',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Routes
app.use("/orders", buyerRouter);
app.use("/orders", sellerRouter);
app.use("/orders", completedOrders);
app.use("/orders", publicKeyRoutes);
