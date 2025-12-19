/**
 * Flow-related TypeScript types
 */

export interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple' | 'text' | 'scale';
    options?: string[];
    tags?: Record<string, string[]>; // option -> tags mapping
    conditionalLogic?: {
        showIf?: {
            questionId: string;
            answer: string | string[];
        };
    };
}

export interface Flow {
    _id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    icon?: string;
    questions: Question[];
    estimatedTime: number; // in minutes
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FlowAnswer {
    questionId: string;
    answer: string | string[];
}

export interface FlowSession {
    _id: string;
    flowId: string;
    userId?: string;
    currentQuestionIndex: number;
    answers: FlowAnswer[];
    extractedTags: string[];
    status: 'in-progress' | 'completed' | 'abandoned';
    completedAt?: string;
    createdAt: string;
    expiresAt: string;
}

export interface FlowsResponse {
    success: boolean;
    data: {
        flows: Flow[];
        pagination?: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface FlowResponse {
    success: boolean;
    data: Flow;
}

export interface FlowSessionResponse {
    success: boolean;
    data: {
        session: FlowSession;
        currentQuestion?: Question;
        isComplete: boolean;
    };
}

export interface StartFlowResponse {
    success: boolean;
    data: {
        sessionId: string;
        question: Question;
    };
}

export interface SubmitAnswerResponse {
    success: boolean;
    data: {
        nextQuestion?: Question;
        isComplete: boolean;
        extractedTags?: string[];
    };
}
