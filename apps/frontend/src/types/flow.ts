/**
 * Flow-related TypeScript types
 * Matching actual backend API response
 */

// Question option in flow
export interface QuestionOption {
    label: string;
    value: string;
}

// Question in flow detail
export interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple' | 'text' | 'scale';
    options?: QuestionOption[];
    required: boolean;
    questionNumber: number;
    totalQuestions: number;
}

// Flow summary (from list endpoint)
export interface FlowSummary {
    _id: string;
    title: string;
    slug: string;
    description: string;
    icon: string;
    category: string;
    popularity: number;
    completionRate: number;
    avgTimeSeconds: number;
    estimatedTimeMinutes: number;
}

// Flow detail (from slug endpoint)
export interface FlowDetail {
    title: string;
    slug: string;
    description: string;
    icon: string;
    category: string;
    totalQuestions: number;
    estimatedTimeMinutes: number;
    questions: Question[];
}

// Flow session start response
export interface FlowStartResponse {
    success: boolean;
    data: {
        sessionId: string;
        flow: {
            title: string;
            slug: string;
            description: string;
            icon: string;
            category: string;
            totalQuestions: number;
            estimatedTimeMinutes: number;
        };
        currentQuestion: Question;
        progress: number;
    };
}

// Submit answer response
export interface SubmitAnswerResponse {
    success: boolean;
    data: {
        sessionId: string;
        currentQuestion?: Question;
        extractedTags: string[];
        progress: number;
        status?: 'completed';
        message?: string;
    };
}

// Session details response
export interface SessionResponse {
    success: boolean;
    data: {
        sessionId: string;
        flow: {
            title: string;
            slug: string;
            description: string;
            icon: string;
            category: string;
            totalQuestions: number;
            estimatedTimeMinutes: number;
        };
        status: 'in_progress' | 'completed' | 'abandoned';
        progress: number;
        answeredQuestions: number;
        extractedTags: string[];
        currentQuestion?: Question;
    };
}

// Flows list response
export interface FlowsListResponse {
    success: boolean;
    data: {
        flows: FlowSummary[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

// Flow detail response
export interface FlowDetailResponse {
    success: boolean;
    data: FlowDetail;
}
