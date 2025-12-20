// services/auth-service/src/models/Interaction.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IInteraction extends Document {
    userId?: Types.ObjectId;
    sessionId: string;
    eventType: "view" | "click" | "save" | "compare" | "flow_start" | "flow_complete";
    toolId?: Types.ObjectId;
    flowId?: Types.ObjectId;
    source?: string;
    metadata?: Record<string, unknown>;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
        sessionId: { type: String, required: true, index: true },

        eventType: {
            type: String,
            enum: ["view", "click", "save", "compare", "flow_start", "flow_complete"],
            required: true,
        },

        toolId: { type: Schema.Types.ObjectId, ref: "Tool", index: true },
        flowId: { type: Schema.Types.ObjectId, ref: "Flow" },

        source: { type: String }, // "search", "flow", "homepage", "comparison"
        metadata: { type: Schema.Types.Mixed },

        userAgent: { type: String },
        ipAddress: { type: String },
    },
    { timestamps: true }
);

// Compound indexes for analytics queries
InteractionSchema.index({ toolId: 1, eventType: 1, createdAt: -1 });
InteractionSchema.index({ userId: 1, eventType: 1, createdAt: -1 });

export const Interaction = model<IInteraction>("Interaction", InteractionSchema);
