import mongoose, { Schema, Document } from 'mongoose';

// Pricing tier interface
interface PricingTier {
    name: string;
    price: number;
    features: string[];
}

// Pricing interface
interface Pricing {
    model: 'free' | 'freemium' | 'paid';
    starting_price?: number;
    tiers?: PricingTier[];
}

// Tool document interface
export interface ITool extends Document {
    // Basic Info
    name: string;
    slug: string;
    tagline?: string;
    description: string;
    long_description?: string;
    logo_url?: string;
    website_url: string;

    // Categorization
    categories: string[];
    problems_solved: string[];
    use_cases: string[];

    // Pricing
    pricing: Pricing;

    // User Guidance
    best_for: string[];
    not_good_for: string[];
    learning_curve: 'low' | 'medium' | 'high';

    // Technical
    has_api: boolean;
    integrations: string[];
    platforms: string[];

    // Trust & Transparency
    privacy_concerns?: string;
    data_location?: string;
    last_verified?: Date;
    verification_notes?: string;

    // Monetization
    affiliate_link?: string;
    is_sponsored: boolean;
    commission_rate?: number;

    // Analytics
    view_count: number;
    click_count: number;

    // Relations
    alternatives: mongoose.Types.ObjectId[];
    similar_tools: mongoose.Types.ObjectId[];

    // Admin
    status: 'draft' | 'published' | 'archived';
    added_by?: mongoose.Types.ObjectId;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Tool Schema
const ToolSchema = new Schema<ITool>(
    {
        // Basic Info
        name: {
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
        tagline: {
            type: String,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        long_description: {
            type: String,
            trim: true
        },
        logo_url: {
            type: String,
            trim: true
        },
        website_url: {
            type: String,
            required: true,
            trim: true
        },

        // Categorization
        categories: {
            type: [String],
            default: []
        },
        problems_solved: {
            type: [String],
            default: []
        },
        use_cases: {
            type: [String],
            default: []
        },

        // Pricing
        pricing: {
            model: {
                type: String,
                enum: ['free', 'freemium', 'paid'],
                required: true
            },
            starting_price: {
                type: Number,
                min: 0
            },
            tiers: [{
                name: String,
                price: Number,
                features: [String]
            }]
        },

        // User Guidance
        best_for: {
            type: [String],
            default: []
        },
        not_good_for: {
            type: [String],
            default: []
        },
        learning_curve: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },

        // Technical
        has_api: {
            type: Boolean,
            default: false
        },
        integrations: {
            type: [String],
            default: []
        },
        platforms: {
            type: [String],
            default: []
        },

        // Trust & Transparency
        privacy_concerns: {
            type: String,
            trim: true
        },
        data_location: {
            type: String,
            trim: true
        },
        last_verified: {
            type: Date
        },
        verification_notes: {
            type: String,
            trim: true
        },

        // Monetization
        affiliate_link: {
            type: String,
            trim: true
        },
        is_sponsored: {
            type: Boolean,
            default: false
        },
        commission_rate: {
            type: Number,
            min: 0,
            max: 100
        },

        // Analytics
        view_count: {
            type: Number,
            default: 0,
            min: 0
        },
        click_count: {
            type: Number,
            default: 0,
            min: 0
        },

        // Relations
        alternatives: [{
            type: Schema.Types.ObjectId,
            ref: 'Tool'
        }],
        similar_tools: [{
            type: Schema.Types.ObjectId,
            ref: 'Tool'
        }],

        // Admin
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        },
        added_by: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

// Indexes
ToolSchema.index({ slug: 1 }, { unique: true });
ToolSchema.index({ name: 'text', description: 'text' });
ToolSchema.index({ categories: 1 });
ToolSchema.index({ problems_solved: 1 });
ToolSchema.index({ status: 1 });
ToolSchema.index({ view_count: -1 });
ToolSchema.index({ createdAt: -1 });

// Middleware
import { slugify } from '../utils/slugify';

ToolSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name);
    }
});

// Export model
export const Tool = mongoose.model<ITool>('Tool', ToolSchema);
