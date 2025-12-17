import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Flow, IFlow } from '../models/Flow';
import { FlowSession } from '../models/FlowSession';
import { CacheService, CACHE_TTL } from '../services/cache.service';
import { FlowService } from '../services/flow.service';
import { QuestionEngine } from '../engine/questionEngine';

// ==================== PUBLIC CONTROLLERS ====================

/**
 * Get all flows with pagination and filters
 * GET /flows?page=1&limit=12&category=interview
 */
export const getAllFlows = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            sort = 'popular'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter query
        const filter: any = { status: 'published' };

        if (category) {
            filter.category = category;
        }

        // Check cache
        const cacheKey = CacheService.getFlowsListKey({ page, limit, category, sort });
        const cached = await CacheService.get<any>(cacheKey);

        if (cached) {
            res.json(cached);
            return;
        }

        // Build sort query
        let sortQuery: any = {};
        switch (sort) {
            case 'popular':
                sortQuery = { popularity: -1 };
                break;
            case 'completion':
                sortQuery = { completionRate: -1 };
                break;
            default:
                sortQuery = { createdAt: -1 };
        }

        // Execute query
        const [flows, total] = await Promise.all([
            Flow.find(filter)
                .sort(sortQuery)
                .limit(limitNum)
                .skip(skip)
                .select('title slug description icon category popularity completionRate avgTimeSeconds')
                .lean(),
            Flow.countDocuments(filter)
        ]);

        // Calculate estimated time for each flow
        const flowsWithMeta = flows.map(flow => ({
            ...flow,
            estimatedTimeMinutes: Math.ceil((flow.avgTimeSeconds || 180) / 60)
        }));

        const response = {
            success: true,
            data: {
                flows: flowsWithMeta,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        };

        // Cache response
        await CacheService.set(cacheKey, response, CACHE_TTL.FLOWS_LIST);

        res.json(response);
    } catch (error) {
        console.error('[getAllFlows] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flows',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get flow by slug
 * GET /flows/:slug
 */
export const getFlowBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;

        // Check cache
        const cacheKey = CacheService.getFlowKey(slug);
        const cached = await CacheService.get<IFlow>(cacheKey);

        if (cached) {
            const engine = new QuestionEngine(cached);
            res.json({
                success: true,
                data: {
                    ...engine.getFlowSummary(),
                    questions: cached.questions.map((_, i) => engine.getQuestionByIndex(i))
                }
            });
            return;
        }

        // Increment popularity
        const flow = await Flow.findOneAndUpdate(
            { slug, status: 'published' },
            { $inc: { popularity: 1 } },
            { new: true }
        ).lean();

        if (!flow) {
            res.status(404).json({
                success: false,
                message: 'Flow not found'
            });
            return;
        }

        // Cache the flow
        await CacheService.set(cacheKey, flow, CACHE_TTL.FLOW_DETAIL);

        const engine = new QuestionEngine(flow);
        res.json({
            success: true,
            data: {
                ...engine.getFlowSummary(),
                questions: flow.questions.map((_, i) => engine.getQuestionByIndex(i))
            }
        });
    } catch (error) {
        console.error('[getFlowBySlug] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flow',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Start a new flow session
 * POST /flows/:slug/start
 */
export const startFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const { userId } = req.body; // Optional

        const flow = await Flow.findOne({ slug, status: 'published' }).lean();

        if (!flow) {
            res.status(404).json({
                success: false,
                message: 'Flow not found'
            });
            return;
        }

        // Create a new session
        const sessionId = uuidv4();
        const session = new FlowSession({
            sessionId,
            flowId: flow._id,
            userId,
            answers: [],
            currentQuestionIndex: 0,
            extractedTags: [],
            status: 'in_progress',
            startedAt: new Date()
        });

        await session.save();

        // Get first question
        const engine = new QuestionEngine(flow);
        const firstQuestion = engine.getQuestionByIndex(0);

        res.status(201).json({
            success: true,
            data: {
                sessionId,
                flow: engine.getFlowSummary(),
                currentQuestion: firstQuestion,
                progress: 0
            }
        });
    } catch (error) {
        console.error('[startFlow] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start flow',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Submit an answer for a flow session
 * POST /flows/sessions/:sessionId/answer
 */
export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.params;
        const { questionId, value } = req.body;

        if (!questionId || value === undefined) {
            res.status(400).json({
                success: false,
                message: 'questionId and value are required'
            });
            return;
        }

        // Find session and populate flow
        const session = await FlowSession.findOne({ sessionId, status: 'in_progress' });

        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found or already completed'
            });
            return;
        }

        const flow = await Flow.findById(session.flowId).lean();

        if (!flow) {
            res.status(404).json({
                success: false,
                message: 'Flow not found'
            });
            return;
        }

        const engine = new QuestionEngine(flow);

        // Validate the answer
        const validation = engine.validateAnswer(questionId, value);
        if (!validation.valid) {
            res.status(400).json({
                success: false,
                message: validation.error
            });
            return;
        }

        // Extract tags from this answer
        const answerTags = FlowService.extractTagsFromAnswer(flow, questionId, value);

        // Add answer to session
        session.answers.push({
            questionId,
            value,
            tags: answerTags,
            answeredAt: new Date()
        });

        // Update extracted tags
        session.extractedTags = FlowService.aggregateTags(session);

        // Determine next question
        const nextResult = engine.getNextQuestion(session.currentQuestionIndex, value);

        if (nextResult) {
            session.currentQuestionIndex = nextResult.index;
        } else {
            // Flow is complete
            session.status = 'completed';
            session.completedAt = new Date();
        }

        await session.save();

        // Calculate progress
        const progress = FlowService.calculateProgress(flow, session.answers.length);

        if (session.status === 'completed') {
            res.json({
                success: true,
                data: {
                    sessionId,
                    status: 'completed',
                    extractedTags: session.extractedTags,
                    progress: 100,
                    message: 'Flow completed successfully'
                }
            });
        } else {
            res.json({
                success: true,
                data: {
                    sessionId,
                    currentQuestion: nextResult?.question,
                    extractedTags: session.extractedTags,
                    progress
                }
            });
        }
    } catch (error) {
        console.error('[submitAnswer] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit answer',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Get session details (for resuming)
 * GET /flows/sessions/:sessionId
 */
export const getSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.params;

        const session = await FlowSession.findOne({ sessionId });

        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }

        const flow = await Flow.findById(session.flowId).lean();

        if (!flow) {
            res.status(404).json({
                success: false,
                message: 'Flow not found'
            });
            return;
        }

        const engine = new QuestionEngine(flow);
        const progress = FlowService.calculateProgress(flow, session.answers.length);

        const responseData: any = {
            sessionId: session.sessionId,
            flow: engine.getFlowSummary(),
            status: session.status,
            progress,
            answeredQuestions: session.answers.length,
            extractedTags: session.extractedTags
        };

        // If in progress, include current question
        if (session.status === 'in_progress') {
            responseData.currentQuestion = engine.getQuestionByIndex(session.currentQuestionIndex);
        }

        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('[getSession] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch session',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Complete a flow session manually
 * POST /flows/sessions/:sessionId/complete
 */
export const completeFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.params;

        const session = await FlowSession.findOne({ sessionId });

        if (!session) {
            res.status(404).json({
                success: false,
                message: 'Session not found'
            });
            return;
        }

        if (session.status === 'completed') {
            res.json({
                success: true,
                data: {
                    sessionId: session.sessionId,
                    status: 'completed',
                    extractedTags: session.extractedTags,
                    message: 'Session was already completed'
                }
            });
            return;
        }

        // Update flow completion stats
        const flow = await Flow.findById(session.flowId);
        if (flow) {
            // Update completion rate (simple moving average)
            const completedSessions = await FlowSession.countDocuments({
                flowId: flow._id,
                status: 'completed'
            });
            const totalSessions = await FlowSession.countDocuments({
                flowId: flow._id,
                status: { $ne: 'in_progress' }
            });

            flow.completionRate = totalSessions > 0
                ? Math.round((completedSessions / totalSessions) * 100)
                : 0;

            // Calculate average time
            const startTime = session.startedAt.getTime();
            const endTime = Date.now();
            const durationSeconds = Math.round((endTime - startTime) / 1000);

            // Simple moving average for avg time
            flow.avgTimeSeconds = flow.avgTimeSeconds > 0
                ? Math.round((flow.avgTimeSeconds + durationSeconds) / 2)
                : durationSeconds;

            await flow.save();
        }

        // Mark session as complete
        session.status = 'completed';
        session.completedAt = new Date();
        await session.save();

        res.json({
            success: true,
            data: {
                sessionId: session.sessionId,
                status: 'completed',
                extractedTags: session.extractedTags,
                message: 'Flow completed successfully'
            }
        });
    } catch (error) {
        console.error('[completeFlow] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete flow',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// ==================== ADMIN CONTROLLERS ====================

/**
 * Create new flow
 * POST /admin/flows
 */
export const createFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        const flowData = req.body;

        const flow = new Flow(flowData);
        await flow.save();

        // Clear cache
        await CacheService.delPattern('flows:*');

        res.status(201).json({
            success: true,
            data: flow,
            message: 'Flow created successfully'
        });
    } catch (error) {
        console.error('[createFlow] Error:', error);

        if ((error as any).code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Flow with this slug already exists'
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create flow',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Update flow
 * PATCH /admin/flows/:id
 */
export const updateFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const flow = await Flow.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!flow) {
            res.status(404).json({
                success: false,
                message: 'Flow not found'
            });
            return;
        }

        // Clear cache
        await CacheService.delPattern('flows:*');
        await CacheService.del(CacheService.getFlowKey(flow.slug));

        res.json({
            success: true,
            data: flow,
            message: 'Flow updated successfully'
        });
    } catch (error) {
        console.error('[updateFlow] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update flow',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

/**
 * Delete flow (soft delete)
 * DELETE /admin/flows/:id
 */
export const deleteFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const flow = await Flow.findByIdAndUpdate(
            id,
            { $set: { status: 'archived' } },
            { new: true }
        );

        if (!flow) {
            res.status(404).json({
                success: false,
                message: 'Flow not found'
            });
            return;
        }

        // Clear cache
        await CacheService.delPattern('flows:*');
        await CacheService.del(CacheService.getFlowKey(flow.slug));

        res.json({
            success: true,
            message: 'Flow archived successfully'
        });
    } catch (error) {
        console.error('[deleteFlow] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete flow',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
