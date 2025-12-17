import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongo, disconnectMongo } from 'db';
import { Flow } from '../models/Flow';


dotenv.config();

const sampleFlows = [
    {
        title: 'Prepare for Interviews',
        slug: 'interview-prep',
        description: 'Find the best AI tools to help you ace your next job interview',
        icon: '🎯',
        category: 'career',
        questions: [
            {
                id: 'q1',
                text: 'What type of role are you interviewing for?',
                type: 'single',
                options: [
                    { label: 'Software Engineering', value: 'software-engineer', tags: ['technical', 'coding', 'algorithms'] },
                    { label: 'Product Management', value: 'product-manager', tags: ['strategy', 'communication', 'metrics'] },
                    { label: 'Data Science', value: 'data-scientist', tags: ['technical', 'analytics', 'ml'] },
                    { label: 'Design', value: 'designer', tags: ['creative', 'portfolio', 'ux'] },
                    { label: 'Marketing', value: 'marketing', tags: ['creative', 'strategy', 'communication'] },
                    { label: 'Other', value: 'other', tags: ['general'] }
                ],
                required: true
            },
            {
                id: 'q2',
                text: 'What is your experience level?',
                type: 'single',
                options: [
                    { label: 'Entry Level (0-2 years)', value: 'entry', tags: ['beginner', 'learning', 'fundamentals'] },
                    { label: 'Mid Level (3-5 years)', value: 'mid', tags: ['intermediate', 'growth'] },
                    { label: 'Senior Level (6-10 years)', value: 'senior', tags: ['advanced', 'leadership'] },
                    { label: 'Executive (10+ years)', value: 'executive', tags: ['leadership', 'strategy', 'executive'] }
                ],
                required: true
            },
            {
                id: 'q3',
                text: 'What aspect of interview prep do you need help with?',
                type: 'multiple',
                options: [
                    { label: 'Mock Interviews', value: 'mock', tags: ['practice', 'simulation', 'feedback'] },
                    { label: 'Technical Questions', value: 'technical', tags: ['coding', 'algorithms', 'system-design'] },
                    { label: 'Behavioral Questions', value: 'behavioral', tags: ['star-method', 'storytelling'] },
                    { label: 'Resume Review', value: 'resume', tags: ['resume', 'ats', 'formatting'] },
                    { label: 'Company Research', value: 'research', tags: ['research', 'culture', 'preparation'] }
                ],
                required: true
            },
            {
                id: 'q4',
                text: 'What is your budget?',
                type: 'single',
                options: [
                    { label: 'Free only', value: 'free', tags: ['free', 'budget-conscious'] },
                    { label: 'Under $20/month', value: 'low', tags: ['freemium', 'affordable'] },
                    { label: '$20-50/month', value: 'medium', tags: ['paid', 'premium'] },
                    { label: 'Price is not a concern', value: 'any', tags: ['premium', 'enterprise'] }
                ],
                required: true
            }
        ],
        requiredTags: [],
        optionalTags: ['interview', 'career', 'job-search'],
        scoringWeights: { price: 3, learningCurve: 2, features: 5 },
        status: 'published'
    },
    {
        title: 'Create Better Content',
        slug: 'content-creation',
        description: 'Discover AI tools to supercharge your content creation workflow',
        icon: '✍️',
        category: 'productivity',
        questions: [
            {
                id: 'q1',
                text: 'What type of content do you create?',
                type: 'multiple',
                options: [
                    { label: 'Blog posts & Articles', value: 'blog', tags: ['writing', 'long-form', 'seo'] },
                    { label: 'Social Media', value: 'social', tags: ['short-form', 'viral', 'engagement'] },
                    { label: 'Video Scripts', value: 'video', tags: ['video', 'scripts', 'youtube'] },
                    { label: 'Email Marketing', value: 'email', tags: ['email', 'copywriting', 'conversion'] },
                    { label: 'Technical Documentation', value: 'docs', tags: ['technical', 'documentation', 'clarity'] }
                ],
                required: true
            },
            {
                id: 'q2',
                text: 'What is your primary platform?',
                type: 'single',
                options: [
                    { label: 'LinkedIn', value: 'linkedin', tags: ['linkedin', 'professional', 'b2b'] },
                    { label: 'Twitter/X', value: 'twitter', tags: ['twitter', 'threads', 'viral'] },
                    { label: 'YouTube', value: 'youtube', tags: ['video', 'youtube', 'thumbnails'] },
                    { label: 'Blog/Website', value: 'blog', tags: ['seo', 'website', 'traffic'] },
                    { label: 'Multiple Platforms', value: 'multi', tags: ['repurposing', 'cross-platform'] }
                ],
                required: true
            },
            {
                id: 'q3',
                text: 'How often do you create content?',
                type: 'single',
                options: [
                    { label: 'Daily', value: 'daily', tags: ['high-volume', 'automation', 'efficiency'] },
                    { label: 'Weekly', value: 'weekly', tags: ['consistency', 'planning'] },
                    { label: 'Monthly', value: 'monthly', tags: ['quality', 'deep-content'] },
                    { label: 'Occasionally', value: 'occasional', tags: ['casual', 'simple'] }
                ],
                required: true
            },
            {
                id: 'q4',
                text: 'What features are most important to you?',
                type: 'multiple',
                options: [
                    { label: 'AI Writing Assistance', value: 'ai-writing', tags: ['ai-writer', 'generation'] },
                    { label: 'SEO Optimization', value: 'seo', tags: ['seo', 'keywords', 'ranking'] },
                    { label: 'Grammar & Style', value: 'grammar', tags: ['grammar', 'style', 'polish'] },
                    { label: 'Image Generation', value: 'images', tags: ['images', 'visuals', 'design'] },
                    { label: 'Analytics & Insights', value: 'analytics', tags: ['analytics', 'performance'] }
                ],
                required: true
            }
        ],
        requiredTags: ['content'],
        optionalTags: ['writing', 'marketing', 'creative'],
        scoringWeights: { price: 2, learningCurve: 3, features: 5 },
        status: 'published'
    },
    {
        title: 'Automate Your Workflow',
        slug: 'automation',
        description: 'Find the perfect automation tools for your business processes',
        icon: '⚡',
        category: 'automation',
        questions: [
            {
                id: 'q1',
                text: 'What do you want to automate?',
                type: 'multiple',
                options: [
                    { label: 'Email & Communication', value: 'email', tags: ['email', 'communication', 'messaging'] },
                    { label: 'Data Entry & Processing', value: 'data', tags: ['data', 'spreadsheets', 'processing'] },
                    { label: 'Sales & CRM', value: 'sales', tags: ['sales', 'crm', 'leads'] },
                    { label: 'Social Media', value: 'social', tags: ['social-media', 'scheduling', 'posting'] },
                    { label: 'File Management', value: 'files', tags: ['files', 'documents', 'storage'] }
                ],
                required: true
            },
            {
                id: 'q2',
                text: 'What is your technical skill level?',
                type: 'single',
                options: [
                    { label: 'No coding experience', value: 'none', tags: ['no-code', 'visual', 'beginner'] },
                    { label: 'Basic (can use spreadsheets)', value: 'basic', tags: ['low-code', 'templates'] },
                    { label: 'Intermediate (some scripting)', value: 'intermediate', tags: ['scripting', 'apis'] },
                    { label: 'Advanced (can code)', value: 'advanced', tags: ['developer', 'api', 'custom'] }
                ],
                required: true
            },
            {
                id: 'q3',
                text: 'How many apps do you need to connect?',
                type: 'single',
                options: [
                    { label: '2-3 apps', value: 'few', tags: ['simple', 'basic-integration'] },
                    { label: '4-10 apps', value: 'several', tags: ['multi-app', 'workflow'] },
                    { label: '10+ apps', value: 'many', tags: ['enterprise', 'complex', 'ecosystem'] }
                ],
                required: true
            },
            {
                id: 'q4',
                text: 'What is your monthly budget for automation?',
                type: 'single',
                options: [
                    { label: 'Free', value: 'free', tags: ['free', 'limited-tasks'] },
                    { label: 'Under $20/month', value: 'starter', tags: ['starter', 'affordable'] },
                    { label: '$20-100/month', value: 'pro', tags: ['professional', 'unlimited'] },
                    { label: '$100+/month', value: 'enterprise', tags: ['enterprise', 'team', 'premium'] }
                ],
                required: true
            }
        ],
        requiredTags: ['automation'],
        optionalTags: ['productivity', 'workflow', 'integration'],
        scoringWeights: { price: 4, learningCurve: 4, features: 2 },
        status: 'published'
    },
    {
        title: 'AI Coding Assistant',
        slug: 'coding-assistant',
        description: 'Find the best AI tools to boost your development productivity',
        icon: '💻',
        category: 'development',
        questions: [
            {
                id: 'q1',
                text: 'What programming languages do you primarily use?',
                type: 'multiple',
                options: [
                    { label: 'JavaScript/TypeScript', value: 'js', tags: ['javascript', 'typescript', 'web'] },
                    { label: 'Python', value: 'python', tags: ['python', 'data', 'ml'] },
                    { label: 'Java/Kotlin', value: 'java', tags: ['java', 'kotlin', 'android'] },
                    { label: 'C/C++/Rust', value: 'systems', tags: ['systems', 'low-level', 'performance'] },
                    { label: 'Go', value: 'go', tags: ['go', 'backend', 'cloud'] },
                    { label: 'Other', value: 'other', tags: ['general'] }
                ],
                required: true
            },
            {
                id: 'q2',
                text: 'What do you need help with?',
                type: 'multiple',
                options: [
                    { label: 'Code Completion', value: 'completion', tags: ['autocomplete', 'suggestions', 'speed'] },
                    { label: 'Code Explanation', value: 'explanation', tags: ['learning', 'understanding', 'docs'] },
                    { label: 'Bug Fixing', value: 'debugging', tags: ['debugging', 'errors', 'fixes'] },
                    { label: 'Code Review', value: 'review', tags: ['review', 'quality', 'best-practices'] },
                    { label: 'Writing Tests', value: 'tests', tags: ['testing', 'unit-tests', 'coverage'] }
                ],
                required: true
            },
            {
                id: 'q3',
                text: 'What IDE do you use?',
                type: 'single',
                options: [
                    { label: 'VS Code', value: 'vscode', tags: ['vscode', 'extensions'] },
                    { label: 'JetBrains (IntelliJ, PyCharm, etc.)', value: 'jetbrains', tags: ['jetbrains', 'intellij'] },
                    { label: 'Vim/Neovim', value: 'vim', tags: ['vim', 'terminal', 'cli'] },
                    { label: 'Cursor', value: 'cursor', tags: ['cursor', 'ai-native'] },
                    { label: 'Other', value: 'other', tags: ['general'] }
                ],
                required: true
            },
            {
                id: 'q4',
                text: 'Do you need to work with private/enterprise codebases?',
                type: 'single',
                options: [
                    { label: 'Yes, privacy is critical', value: 'private', tags: ['privacy', 'enterprise', 'secure', 'on-prem'] },
                    { label: 'Sometimes, but not critical', value: 'sometimes', tags: ['mixed', 'flexible'] },
                    { label: 'No, public code is fine', value: 'public', tags: ['open-source', 'cloud'] }
                ],
                required: true
            }
        ],
        requiredTags: ['coding', 'developer'],
        optionalTags: ['productivity', 'ai-assistant'],
        scoringWeights: { price: 2, learningCurve: 1, features: 7 },
        status: 'published'
    },
    {
        title: 'Research & Learn Faster',
        slug: 'research-learning',
        description: 'Discover AI tools that help you research and learn more efficiently',
        icon: '📚',
        category: 'learning',
        questions: [
            {
                id: 'q1',
                text: 'What are you researching or learning about?',
                type: 'multiple',
                options: [
                    { label: 'Academic/Scientific Topics', value: 'academic', tags: ['academic', 'papers', 'citations'] },
                    { label: 'Business & Market Research', value: 'business', tags: ['business', 'market', 'trends'] },
                    { label: 'Technical Skills', value: 'technical', tags: ['technical', 'tutorials', 'coding'] },
                    { label: 'News & Current Events', value: 'news', tags: ['news', 'current', 'updates'] },
                    { label: 'Personal Development', value: 'personal', tags: ['personal', 'self-help', 'habits'] }
                ],
                required: true
            },
            {
                id: 'q2',
                text: 'What type of output do you need?',
                type: 'multiple',
                options: [
                    { label: 'Summarized Insights', value: 'summary', tags: ['summary', 'quick', 'digest'] },
                    { label: 'Detailed Analysis', value: 'analysis', tags: ['deep', 'analysis', 'comprehensive'] },
                    { label: 'Q&A / Chat Interface', value: 'chat', tags: ['chat', 'interactive', 'questions'] },
                    { label: 'Organized Notes', value: 'notes', tags: ['notes', 'organization', 'knowledge-base'] },
                    { label: 'Visual/Mindmaps', value: 'visual', tags: ['visual', 'diagrams', 'mindmap'] }
                ],
                required: true
            },
            {
                id: 'q3',
                text: 'What sources do you typically use?',
                type: 'multiple',
                options: [
                    { label: 'PDFs & Documents', value: 'pdfs', tags: ['pdf', 'documents', 'files'] },
                    { label: 'Websites & Articles', value: 'web', tags: ['web', 'browsing', 'articles'] },
                    { label: 'YouTube Videos', value: 'youtube', tags: ['video', 'youtube', 'transcripts'] },
                    { label: 'Academic Papers', value: 'papers', tags: ['papers', 'arxiv', 'scholarly'] },
                    { label: 'Books', value: 'books', tags: ['books', 'ebooks', 'reading'] }
                ],
                required: true
            },
            {
                id: 'q4',
                text: 'How important is source citation?',
                type: 'single',
                options: [
                    { label: 'Critical - need proper citations', value: 'critical', tags: ['citations', 'academic', 'verified'] },
                    { label: 'Nice to have', value: 'nice', tags: ['references', 'links'] },
                    { label: 'Not important', value: 'none', tags: ['casual', 'general'] }
                ],
                required: true
            }
        ],
        requiredTags: ['research', 'learning'],
        optionalTags: ['knowledge', 'study', 'education'],
        scoringWeights: { price: 3, learningCurve: 3, features: 4 },
        status: 'published'
    }
];

async function seed() {
    try {
        console.log('🌱 Starting seed...');

        await connectMongo(
            process.env.MONGODB_URI!,
            process.env.MONGODB_DB_NAME || 'decidrai_flows'
        );

        // Clear existing flows
        await Flow.deleteMany({});
        console.log('🗑️  Cleared existing flows');

        // Insert sample flows
        const result = await Flow.insertMany(sampleFlows);
        console.log(`✅ Seeded ${result.length} flows:`);

        result.forEach(flow => {
            console.log(`   - ${flow.title} (${flow.slug})`);
        });

        await disconnectMongo();
        console.log('\n🌱 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

seed();
