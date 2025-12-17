import mongoose, { Schema, Document } from 'mongoose';

// Answer interface
interface SessionAnswer {
    questionId: string;
    value: string | string[];
    tags: string[];
    answeredAt: Date;
}

// Flow Session document interface
export interface IFlowSession extends Document {
    sessionId: string;
    flowId: mongoose.Types.ObjectId;
    userId?: string;

    // Progress
    answers: SessionAnswer[];
    currentQuestionIndex: number;
    extractedTags: string[];

    // Status
    status: 'in_progress' | 'completed' | 'abandoned';
    startedAt: Date;
    completedAt?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Answer Schema
const SessionAnswerSchema = new Schema({
    questionId: {
        type: String,
        required: true
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    answeredAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

// Flow Session Schema
const FlowSessionSchema = new Schema<IFlowSession>(
    {
        sessionId: {
            type: String,
            required: true,
            index: true
        },
        flowId: {
            type: Schema.Types.ObjectId,
            ref: 'Flow',
            required: true,
            index: true
        },
        userId: {
            type: String,
            index: true
        },

        // Progress
        answers: {
            type: [SessionAnswerSchema],
            default: []
        },
        currentQuestionIndex: {
            type: Number,
            default: 0,
            min: 0
        },
        extractedTags: {
            type: [String],
            default: []
        },

        // Status
        status: {
            type: String,
            enum: ['in_progress', 'completed', 'abandoned'],
            default: 'in_progress'
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Indexes
FlowSessionSchema.index({ sessionId: 1 }, { unique: true });
FlowSessionSchema.index({ flowId: 1, status: 1 });
FlowSessionSchema.index({ userId: 1, status: 1 });
FlowSessionSchema.index({ createdAt: -1 });

// TTL index - sessions expire after 7 days of inactivity
FlowSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

// Export model
export const FlowSession = mongoose.model<IFlowSession>('FlowSession', FlowSessionSchema);
