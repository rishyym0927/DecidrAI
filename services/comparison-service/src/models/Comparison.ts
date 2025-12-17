import mongoose, { Schema, Document } from 'mongoose';

/**
 * Winner scenario - when a specific tool wins
 */
export interface IWinnerScenario {
    toolId: mongoose.Types.ObjectId;
    toolSlug: string;
    scenario: string;
    reasoning: string;
}

/**
 * Feature comparison entry
 */
export interface IFeatureComparison {
    feature: string;
    description?: string;
    toolValues: Map<string, string>; // toolSlug -> value
}

/**
 * Comparison document interface
 */
export interface IComparison extends Document {
    toolIds: mongoose.Types.ObjectId[];
    toolSlugs: string[];

    // AI-generated content
    summary: string;
    winnerScenarios: IWinnerScenario[];
    featureComparison: IFeatureComparison[];

    // Metadata
    generatedAt: Date;
    cacheUntil: Date;
    generationModel: string;
    viewCount: number;

    createdAt: Date;
    updatedAt: Date;
}

/**
 * Winner scenario schema
 */
const WinnerScenarioSchema = new Schema<IWinnerScenario>({
    toolId: { type: Schema.Types.ObjectId, required: true },
    toolSlug: { type: String, required: true },
    scenario: { type: String, required: true },
    reasoning: { type: String, required: true }
}, { _id: false });

/**
 * Feature comparison schema
 */
const FeatureComparisonSchema = new Schema<IFeatureComparison>({
    feature: { type: String, required: true },
    description: { type: String },
    toolValues: { type: Map, of: String, required: true }
}, { _id: false });

/**
 * Comparison schema
 */
const ComparisonSchema = new Schema<IComparison>({
    toolIds: {
        type: [Schema.Types.ObjectId],
        required: true,
        validate: {
            validator: (v: mongoose.Types.ObjectId[]) => v.length >= 2 && v.length <= 4,
            message: 'Comparison requires 2-4 tools'
        }
    },
    toolSlugs: {
        type: [String],
        required: true,
        validate: {
            validator: (v: string[]) => v.length >= 2 && v.length <= 4,
            message: 'Comparison requires 2-4 tool slugs'
        }
    },

    summary: { type: String, required: true },
    winnerScenarios: { type: [WinnerScenarioSchema], default: [] },
    featureComparison: { type: [FeatureComparisonSchema], default: [] },

    generatedAt: { type: Date, default: Date.now },
    cacheUntil: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    },
    generationModel: { type: String, default: 'gemini-1.5-flash' },
    viewCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Index for quick lookup by tools
ComparisonSchema.index({ toolSlugs: 1 });
ComparisonSchema.index({ toolIds: 1 });

export const Comparison = mongoose.model<IComparison>('Comparison', ComparisonSchema);
