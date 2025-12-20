// services/auth-service/src/models/User.ts
import { Schema, model, Document, Types } from "mongoose";

// Interface for saved tools
interface ISavedTool {
  toolId: Types.ObjectId;
  savedAt: Date;
  notes?: string;
}

// Interface for AI Stack items
interface IAiStackItem {
  toolId: Types.ObjectId;
  category: string;
  notes?: string;
  addedAt: Date;
}

// Interface for user profile
interface IUserProfile {
  bio?: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  interests?: string[];
}

// Interface for preferences
interface IPreferences {
  emailNotifications: boolean;
  theme: "light" | "dark" | "system";
}

// Main User interface
export interface IUser extends Document {
  clerkUserId: string;
  email?: string;
  name?: string;
  image?: string;
  role: "user" | "admin";
  profile: IUserProfile;
  savedTools: ISavedTool[];
  aiStack: IAiStackItem[];
  preferences: IPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    image: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Extended profile fields
    profile: {
      bio: { type: String, maxlength: 500 },
      experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
      interests: [{ type: String }],
    },

    // Saved tools for quick access
    savedTools: [{
      toolId: { type: Schema.Types.ObjectId, ref: "Tool" },
      savedAt: { type: Date, default: Date.now },
      notes: { type: String, maxlength: 500 },
    }],

    // Personal AI Stack - curated tools collection
    aiStack: [{
      toolId: { type: Schema.Types.ObjectId, ref: "Tool" },
      category: { type: String, required: true },
      notes: { type: String, maxlength: 500 },
      addedAt: { type: Date, default: Date.now },
    }],

    // User preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
UserSchema.index({ "savedTools.toolId": 1 });
UserSchema.index({ "aiStack.toolId": 1 });

export const User = model<IUser>("User", UserSchema);
