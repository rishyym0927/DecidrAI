import express from "express";
import { Webhook } from "svix";
import { upsertUser, deleteUser } from "../services/user.service";

const clerkWebhook = express.Router();

clerkWebhook.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const payload = req.body;
      const headers = req.headers;

      console.log("🔔 Webhook received!");
      console.log("Headers:", JSON.stringify(headers, null, 2));
      console.log("Body type:", typeof payload, "Is Buffer:", Buffer.isBuffer(payload));

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

      const event = wh.verify(
        payload,
        headers as any
      ) as any;

      console.log("✅ Verified event:", event.type);

      if (event.type === "user.created" || event.type === "user.updated") {
        const data = event.data;
        console.log(`👤 Processing user ${event.type}:`, data.id);

        try {
          const user = await upsertUser(data);
          if (user) {
            console.log("🎉 User saved in DB:", user._id);
          }
        } catch (dbErr) {
          console.error("❌ Database operation failed:", dbErr);
        }
      } else if (event.type === "user.deleted") {
        const data = event.data;
        try {
          await deleteUser(data.id);
          console.log("🗑️ User deleted:", data.id);
        } catch (err) {
          console.error("Delete failed:", err);
        }
      } else {
        console.log("ℹ️ Unhandled event type:", event.type);
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).json({ error: "Webhook failed" });
    }
  }
);

export default clerkWebhook;
