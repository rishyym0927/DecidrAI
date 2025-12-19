"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tool = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Tool Schema
const ToolSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tool'
        }],
    similar_tools: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tool'
        }],
    // Admin
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    added_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
// Indexes
ToolSchema.index({ slug: 1 }, { unique: true });
ToolSchema.index({ name: 'text', description: 'text' });
ToolSchema.index({ categories: 1 });
ToolSchema.index({ problems_solved: 1 });
ToolSchema.index({ status: 1 });
ToolSchema.index({ view_count: -1 });
ToolSchema.index({ createdAt: -1 });
// Middleware
const slugify_1 = require("../utils/slugify");
ToolSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        this.slug = (0, slugify_1.slugify)(this.name);
    }
});
// Export model
exports.Tool = mongoose_1.default.model('Tool', ToolSchema);
