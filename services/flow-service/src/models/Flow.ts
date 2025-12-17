import mongoose, { Schema, Document } from 'mongoose';

// Question option interface
interface QuestionOption {
    label: string;
    value: string;
    tags: string[];
}

// Question interface
interface FlowQuestion {
    id: string;
    text: string;
    type: 'single' | 'multiple' | 'range' | 'text';
    options: QuestionOption[];
    required: boolean;
    nextQuestionLogic?: {
        conditions: Array<{
            answerValue: string | string[];
            skipToQuestionId?: string;
            endFlow?: boolean;
        }>;
    };
}

// Scoring weights interface
interface ScoringWeights {
    price: number;
    learningCurve: number;
    features: number;
}

// Flow document interface
export interface IFlow extends Document {
    // Basic Info
    title: string;
    slug: string;
    description: string;
    icon?: string;

    // Flow Structure
    questions: FlowQuestion[];

    // Matching Configuration
    requiredTags: string[];
    optionalTags: string[];
    scoringWeights: ScoringWeights;

    // Metadata
    category: string;
    popularity: number;
    completionRate: number;
    avgTimeSeconds: number;

    // Admin
    status: 'draft' | 'published' | 'archived';

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Question Option Schema
const QuestionOptionSchema = new Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: []
    }
}, { _id: false });

// Question Schema
const FlowQuestionSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['single', 'multiple', 'range', 'text'],
        default: 'single'
    },
    options: {
        type: [QuestionOptionSchema],
        default: []
    },
    required: {
        type: Boolean,
        default: true
    },
    nextQuestionLogic: {
        conditions: [{
            answerValue: Schema.Types.Mixed,
            skipToQuestionId: String,
            endFlow: Boolean
        }]
    }
}, { _id: false });

// Flow Schema
const FlowSchema = new Schema<IFlow>(
    {
        // Basic Info
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        icon: {
            type: String,
            trim: true
        },

        // Flow Structure
        questions: {
            type: [FlowQuestionSchema],
            default: []
        },

        // Matching Configuration
        requiredTags: {
            type: [String],
            default: []
        },
        optionalTags: {
            type: [String],
            default: []
        },
        scoringWeights: {
            price: {
                type: Number,
                default: 1,
                min: 0,
                max: 10
            },
            learningCurve: {
                type: Number,
                default: 1,
                min: 0,
                max: 10
            },
            features: {
                type: Number,
                default: 1,
                min: 0,
                max: 10
            }
        },

        // Metadata
        category: {
            type: String,
            trim: true,
            default: 'general'
        },
        popularity: {
            type: Number,
            default: 0,
            min: 0
        },
        completionRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        avgTimeSeconds: {
            type: Number,
            default: 0,
            min: 0
        },

        // Admin
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        }
    },
    {
        timestamps: true
    }
);

// Indexes
FlowSchema.index({ slug: 1 }, { unique: true });
FlowSchema.index({ title: 'text', description: 'text' });
FlowSchema.index({ category: 1 });
FlowSchema.index({ status: 1 });
FlowSchema.index({ popularity: -1 });
FlowSchema.index({ createdAt: -1 });

// Generate slug from title
import { slugify } from '../utils/slugify';

FlowSchema.pre('validate', function () {
    if (this.title && !this.slug) {
        this.slug = slugify(this.title);
    }
});

// Export model
export const Flow = mongoose.model<IFlow>('Flow', FlowSchema);
