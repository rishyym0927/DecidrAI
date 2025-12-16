import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.get("/health", (_, res) => {
  res.json({ status: "API Gateway is running" });
});

// Protected routes
app.use(authMiddleware);

// Example Protected Route (for testing)

app.get("/protected", (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user
  });
});


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
