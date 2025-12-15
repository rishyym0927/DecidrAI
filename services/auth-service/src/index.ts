import express from "express";
import dotenv from "dotenv";
import { getDB } from "./db";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", async (_, res) => {
  try {
    await getDB(); 
    res.json({ status: "ok", db: "connected" });
    const result = await getDB();
    console.log(result);
  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Auth service on ${process.env.PORT}`);
});
