import express from "express";
import dotenv from "dotenv";
import { getDB } from "./db";
import { getRedisClient } from "../../../packages/db/src/index";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", async (_, res) => {
  try {
    await getDB(); 
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error" });
  }
});

//test route
app.get("/redis-test", async (_, res) => {
  try {
    const redis = getRedisClient();
    await redis.set("test", "hello");
    const value = await redis.get("test");
    res.json({ redisWorking: value === "hello" });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Redis operation failed" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Recommendation service on ${process.env.PORT}`);
});
