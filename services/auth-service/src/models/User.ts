// services/auth-service/src/models/User.ts
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String},
    name: { type: String },
    image: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
