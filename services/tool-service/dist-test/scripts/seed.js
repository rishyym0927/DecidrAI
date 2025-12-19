"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("../../../../packages/db/src/mongo");
const Tool_1 = require("../models/Tool");
dotenv_1.default.config();
const sampleTools = [
    {
        name: 'ChatGPT',
        tagline: 'Conversational AI that understands and generates human-like text',
        description: 'OpenAI\'s ChatGPT is a powerful conversational AI that can help with writing, coding, analysis, and creative tasks.',
        long_description: 'ChatGPT is a state-of-the-art language model developed by OpenAI. It can engage in natural conversations, write code, create content, answer questions, and assist with a wide variety of tasks. Built on GPT-4 architecture, it understands context and nuance to provide helpful, accurate responses.',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        website_url: 'https://chat.openai.com',
        categories: ['productivity', 'writing', 'coding', 'research'],
        problems_solved: ['content-creation', 'coding-assistance', 'research', 'learning'],
        use_cases: ['Writing assistance', 'Code generation', 'Research', 'Brainstorming', 'Learning'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['GPT-3.5 access', 'Basic features'] },
                { name: 'Plus', price: 20, features: ['GPT-4 access', 'Faster responses', 'Priority access'] }
            ]
        },
        best_for: ['Content creators', 'Developers', 'Students', 'Professionals'],
        not_good_for: ['Real-time data', 'Medical advice', 'Legal advice'],
        learning_curve: 'low',
        has_api: true,
        integrations: ['Microsoft', 'Slack', 'Zapier'],
        platforms: ['web', 'mobile', 'api'],
        privacy_concerns: 'Data used for training unless opted out',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Midjourney',
        tagline: 'AI art generator that creates stunning images from text descriptions',
        description: 'Midjourney is an AI-powered tool that generates high-quality, artistic images from text prompts.',
        long_description: 'Midjourney is a leading AI image generation platform that creates stunning, artistic visuals from text descriptions. It excels at creating concept art, illustrations, and creative imagery with unique artistic styles.',
        logo_url: 'https://cdn.worldvectorlogo.com/logos/midjourney.svg',
        website_url: 'https://midjourney.com',
        categories: ['design', 'art', 'creativity'],
        problems_solved: ['image-generation', 'design', 'creative-work'],
        use_cases: ['Concept art', 'Illustrations', 'Marketing visuals', 'Creative projects'],
        pricing: {
            model: 'paid',
            starting_price: 10,
            tiers: [
                { name: 'Basic', price: 10, features: ['200 images/month', 'Standard quality'] },
                { name: 'Standard', price: 30, features: ['Unlimited images', 'Fast mode'] },
                { name: 'Pro', price: 60, features: ['Stealth mode', 'Max speed'] }
            ]
        },
        best_for: ['Artists', 'Designers', 'Content creators', 'Marketers'],
        not_good_for: ['Photorealistic portraits', 'Text in images', 'Precise layouts'],
        learning_curve: 'medium',
        has_api: false,
        integrations: ['Discord'],
        platforms: ['web', 'discord'],
        privacy_concerns: 'Images are public by default',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'GitHub Copilot',
        tagline: 'AI pair programmer that helps you write code faster',
        description: 'GitHub Copilot is an AI coding assistant that suggests code completions and entire functions in real-time.',
        long_description: 'GitHub Copilot is an AI-powered code completion tool developed by GitHub and OpenAI. It analyzes your code context and suggests relevant code snippets, functions, and even entire algorithms. Trained on billions of lines of code, it supports dozens of programming languages.',
        logo_url: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
        website_url: 'https://github.com/features/copilot',
        categories: ['coding', 'productivity', 'development'],
        problems_solved: ['coding-assistance', 'productivity', 'learning'],
        use_cases: ['Code completion', 'Function generation', 'Documentation', 'Learning new languages'],
        pricing: {
            model: 'paid',
            starting_price: 10,
            tiers: [
                { name: 'Individual', price: 10, features: ['Code suggestions', 'Multi-language support'] },
                { name: 'Business', price: 19, features: ['Team features', 'Policy controls'] }
            ]
        },
        best_for: ['Developers', 'Students', 'Teams'],
        not_good_for: ['Non-coders', 'Security-critical code without review'],
        learning_curve: 'low',
        has_api: true,
        integrations: ['VS Code', 'Visual Studio', 'JetBrains', 'Neovim'],
        platforms: ['desktop', 'api'],
        privacy_concerns: 'Code snippets analyzed',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Notion AI',
        tagline: 'AI-powered workspace for notes, docs, and collaboration',
        description: 'Notion AI enhances your workspace with AI writing, summarization, and brainstorming capabilities.',
        long_description: 'Notion AI brings artificial intelligence directly into your Notion workspace. It can write content, summarize documents, generate ideas, translate text, and help organize information. Seamlessly integrated with Notion\'s powerful database and collaboration features.',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
        website_url: 'https://notion.so',
        categories: ['productivity', 'writing', 'collaboration'],
        problems_solved: ['productivity', 'content-creation', 'organization'],
        use_cases: ['Note-taking', 'Documentation', 'Project management', 'Knowledge base'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['Basic features', 'Limited AI'] },
                { name: 'Plus', price: 10, features: ['Unlimited AI', 'Advanced features'] }
            ]
        },
        best_for: ['Teams', 'Students', 'Content creators', 'Project managers'],
        not_good_for: ['Complex spreadsheets', 'Real-time collaboration'],
        learning_curve: 'medium',
        has_api: true,
        integrations: ['Slack', 'Google Drive', 'GitHub', 'Figma'],
        platforms: ['web', 'mobile', 'desktop', 'api'],
        privacy_concerns: 'Standard data processing',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Jasper',
        tagline: 'AI content platform for marketing teams',
        description: 'Jasper is an AI writing assistant that helps create marketing copy, blog posts, and social media content.',
        long_description: 'Jasper is a comprehensive AI content platform designed for marketing teams and content creators. It can generate blog posts, ad copy, social media content, emails, and more. With brand voice customization and team collaboration features, it\'s built for professional content creation at scale.',
        logo_url: 'https://www.jasper.ai/images/jasper-logo.svg',
        website_url: 'https://jasper.ai',
        categories: ['writing', 'marketing', 'productivity'],
        problems_solved: ['content-creation', 'marketing', 'copywriting'],
        use_cases: ['Blog writing', 'Ad copy', 'Social media', 'Email campaigns', 'SEO content'],
        pricing: {
            model: 'paid',
            starting_price: 49,
            tiers: [
                { name: 'Creator', price: 49, features: ['1 user', 'Unlimited words'] },
                { name: 'Teams', price: 125, features: ['3 users', 'Collaboration', 'Brand voice'] }
            ]
        },
        best_for: ['Marketers', 'Content teams', 'Agencies', 'Bloggers'],
        not_good_for: ['Technical writing', 'Academic papers', 'Budget-conscious individuals'],
        learning_curve: 'low',
        has_api: true,
        integrations: ['Surfer SEO', 'Grammarly', 'Copyscape'],
        platforms: ['web', 'api'],
        privacy_concerns: 'Standard data processing',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Grammarly',
        tagline: 'AI-powered writing assistant for clear, mistake-free writing',
        description: 'Grammarly helps improve your writing with real-time grammar, spelling, and style suggestions.',
        long_description: 'Grammarly is a comprehensive writing assistant that goes beyond basic grammar checking. It provides real-time suggestions for grammar, spelling, punctuation, clarity, engagement, and delivery. With tone detection and plagiarism checking, it helps you write with confidence across all platforms.',
        logo_url: 'https://static.grammarly.com/assets/files/efe57d016588e2ff84c7e2a1c0f8e9c5/grammarly_logo.svg',
        website_url: 'https://grammarly.com',
        categories: ['writing', 'productivity'],
        problems_solved: ['writing-improvement', 'grammar', 'clarity'],
        use_cases: ['Email writing', 'Document editing', 'Academic writing', 'Professional communication'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['Basic grammar', 'Spelling'] },
                { name: 'Premium', price: 12, features: ['Advanced suggestions', 'Tone detection', 'Plagiarism'] }
            ]
        },
        best_for: ['Students', 'Professionals', 'Writers', 'Non-native speakers'],
        not_good_for: ['Creative writing style', 'Technical jargon'],
        learning_curve: 'low',
        has_api: false,
        integrations: ['Chrome', 'Word', 'Gmail', 'Slack'],
        platforms: ['web', 'desktop', 'mobile', 'browser-extension'],
        privacy_concerns: 'Text analyzed for suggestions',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Runway ML',
        tagline: 'AI-powered creative tools for video editing and generation',
        description: 'Runway ML offers AI tools for video editing, including background removal, motion tracking, and video generation.',
        long_description: 'Runway ML is a creative suite powered by AI that makes advanced video editing accessible to everyone. It offers tools for background removal, object tracking, green screen replacement, video generation from text, and more. Used by creators, filmmakers, and artists worldwide.',
        logo_url: 'https://runwayml.com/logo.svg',
        website_url: 'https://runwayml.com',
        categories: ['video', 'creativity', 'design'],
        problems_solved: ['video-editing', 'creative-work', 'content-creation'],
        use_cases: ['Video editing', 'VFX', 'Content creation', 'Film production'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['Limited credits', 'Basic tools'] },
                { name: 'Standard', price: 12, features: ['More credits', 'All tools'] },
                { name: 'Pro', price: 28, features: ['Unlimited credits', 'Priority processing'] }
            ]
        },
        best_for: ['Video creators', 'Filmmakers', 'Content creators', 'Artists'],
        not_good_for: ['Professional film production', 'High-resolution exports on free plan'],
        learning_curve: 'medium',
        has_api: true,
        integrations: ['Adobe', 'DaVinci Resolve'],
        platforms: ['web', 'api'],
        privacy_concerns: 'Videos processed in cloud',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'ElevenLabs',
        tagline: 'AI voice generator with realistic text-to-speech',
        description: 'ElevenLabs creates incredibly realistic AI voices for narration, audiobooks, and content creation.',
        long_description: 'ElevenLabs is a cutting-edge AI voice generation platform that produces highly realistic and emotionally expressive speech. It supports voice cloning, multilingual voices, and fine-tuned control over delivery. Perfect for audiobooks, podcasts, video narration, and accessibility.',
        logo_url: 'https://elevenlabs.io/logo.svg',
        website_url: 'https://elevenlabs.io',
        categories: ['audio', 'content-creation', 'accessibility'],
        problems_solved: ['voice-generation', 'content-creation', 'accessibility'],
        use_cases: ['Audiobooks', 'Podcasts', 'Video narration', 'Accessibility', 'Voice cloning'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['10k characters/month', 'Basic voices'] },
                { name: 'Starter', price: 5, features: ['30k characters/month', 'Voice cloning'] },
                { name: 'Creator', price: 22, features: ['100k characters/month', 'Commercial use'] }
            ]
        },
        best_for: ['Content creators', 'Authors', 'Podcasters', 'Developers'],
        not_good_for: ['Real-time conversation', 'Singing'],
        learning_curve: 'low',
        has_api: true,
        integrations: ['API', 'Zapier'],
        platforms: ['web', 'api'],
        privacy_concerns: 'Voice data processed',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Perplexity',
        tagline: 'AI-powered answer engine for research and discovery',
        description: 'Perplexity is an AI search engine that provides accurate answers with cited sources.',
        long_description: 'Perplexity AI is a conversational answer engine that combines the power of large language models with real-time web search. It provides accurate, cited answers to your questions, making research faster and more reliable. Unlike traditional search engines, it understands context and provides direct answers.',
        logo_url: 'https://www.perplexity.ai/logo.svg',
        website_url: 'https://perplexity.ai',
        categories: ['research', 'productivity', 'search'],
        problems_solved: ['research', 'information-discovery', 'learning'],
        use_cases: ['Research', 'Fact-checking', 'Learning', 'News discovery', 'Academic work'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['Unlimited searches', 'Basic model'] },
                { name: 'Pro', price: 20, features: ['GPT-4', 'Claude', 'File upload', 'API access'] }
            ]
        },
        best_for: ['Researchers', 'Students', 'Professionals', 'Curious minds'],
        not_good_for: ['Creative writing', 'Subjective opinions'],
        learning_curve: 'low',
        has_api: true,
        integrations: ['Browser extensions'],
        platforms: ['web', 'mobile', 'api'],
        privacy_concerns: 'Searches may be used for improvement',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    },
    {
        name: 'Claude',
        tagline: 'AI assistant by Anthropic focused on safety and helpfulness',
        description: 'Claude is a next-generation AI assistant that excels at analysis, writing, coding, and conversation.',
        long_description: 'Claude is Anthropic\'s AI assistant, designed with a focus on safety, accuracy, and helpfulness. It excels at complex reasoning, analysis, creative writing, coding, and maintaining context in long conversations. Claude is particularly strong at understanding nuance and following detailed instructions.',
        logo_url: 'https://www.anthropic.com/images/claude-logo.svg',
        website_url: 'https://claude.ai',
        categories: ['productivity', 'writing', 'coding', 'research'],
        problems_solved: ['content-creation', 'coding-assistance', 'analysis', 'research'],
        use_cases: ['Writing', 'Coding', 'Research', 'Analysis', 'Brainstorming'],
        pricing: {
            model: 'freemium',
            starting_price: 0,
            tiers: [
                { name: 'Free', price: 0, features: ['Claude access', 'Limited usage'] },
                { name: 'Pro', price: 20, features: ['5x more usage', 'Priority access', 'Early features'] }
            ]
        },
        best_for: ['Researchers', 'Writers', 'Developers', 'Analysts'],
        not_good_for: ['Real-time data', 'Image generation'],
        learning_curve: 'low',
        has_api: true,
        integrations: ['API', 'Slack'],
        platforms: ['web', 'api'],
        privacy_concerns: 'Strong privacy focus, data not used for training',
        data_location: 'US',
        last_verified: new Date(),
        status: 'published'
    }
];
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...\n');
        // Connect to MongoDB
        await (0, mongo_1.connectMongo)(process.env.MONGODB_URI, process.env.MONGODB_DB_NAME || 'decidrai_tools');
        // Clear existing tools (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing tools...');
        await Tool_1.Tool.deleteMany({});
        console.log('✅ Existing tools cleared\n');
        // Insert sample tools
        console.log('📝 Inserting sample tools...');
        const inserted = await Tool_1.Tool.insertMany(sampleTools);
        console.log(`✅ Inserted ${inserted.length} tools\n`);
        // Display inserted tools
        console.log('📋 Inserted tools:');
        inserted.forEach((tool, index) => {
            console.log(`   ${index + 1}. ${tool.name} (${tool.slug})`);
        });
        console.log('\n✨ Database seeding completed successfully!\n');
        // Disconnect
        await (0, mongo_1.disconnectMongo)();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
// Run the seed function
seedDatabase();
