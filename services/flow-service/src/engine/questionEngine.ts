import { IFlow } from '../models/Flow';

/**
 * Question Engine
 * Handles dynamic question serving and conditional branching
 */

export class QuestionEngine {
    private flow: IFlow;

    constructor(flow: IFlow) {
        this.flow = flow;
    }

    /**
     * Get question by index
     */
    getQuestionByIndex(index: number) {
        if (index < 0 || index >= this.flow.questions.length) {
            return null;
        }

        const question = this.flow.questions[index];
        return {
            id: question.id,
            text: question.text,
            type: question.type,
            options: question.options.map(opt => ({
                label: opt.label,
                value: opt.value
                // Note: tags are not exposed to client
            })),
            required: question.required,
            questionNumber: index + 1,
            totalQuestions: this.flow.questions.length
        };
    }

    /**
     * Get question by ID
     */
    getQuestionById(questionId: string) {
        const index = this.flow.questions.findIndex(q => q.id === questionId);
        return this.getQuestionByIndex(index);
    }

    /**
     * Evaluate if a condition matches the given answers
     */
    evaluateCondition(
        condition: { answerValue: string | string[]; skipToQuestionId?: string; endFlow?: boolean },
        answerValue: string | string[]
    ): boolean {
        const conditionValues = Array.isArray(condition.answerValue)
            ? condition.answerValue
            : [condition.answerValue];
        const matchingValues = Array.isArray(answerValue) ? answerValue : [answerValue];

        return matchingValues.some(v => conditionValues.includes(v));
    }

    /**
     * Determine the next question based on current state
     * Returns the next question or null if flow is complete
     */
    getNextQuestion(
        currentIndex: number,
        currentAnswer: string | string[]
    ): { question: any; index: number } | null {
        const currentQuestion = this.flow.questions[currentIndex];
        if (!currentQuestion) return null;

        // Check for conditional logic
        if (currentQuestion.nextQuestionLogic?.conditions) {
            for (const condition of currentQuestion.nextQuestionLogic.conditions) {
                if (this.evaluateCondition(condition, currentAnswer)) {
                    if (condition.endFlow) {
                        return null; // Flow ends
                    }
                    if (condition.skipToQuestionId) {
                        const skipIndex = this.flow.questions.findIndex(
                            q => q.id === condition.skipToQuestionId
                        );
                        if (skipIndex !== -1) {
                            return {
                                question: this.getQuestionByIndex(skipIndex),
                                index: skipIndex
                            };
                        }
                    }
                }
            }
        }

        // Default: move to next question
        const nextIndex = currentIndex + 1;
        if (nextIndex >= this.flow.questions.length) {
            return null; // Flow complete
        }

        return {
            question: this.getQuestionByIndex(nextIndex),
            index: nextIndex
        };
    }

    /**
     * Validate an answer against question requirements
     */
    validateAnswer(questionId: string, value: string | string[]): { valid: boolean; error?: string } {
        const question = this.flow.questions.find(q => q.id === questionId);

        if (!question) {
            return { valid: false, error: 'Question not found' };
        }

        // Check if required
        if (question.required) {
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return { valid: false, error: 'This question requires an answer' };
                }
            } else if (!value || value.trim() === '') {
                return { valid: false, error: 'This question requires an answer' };
            }
        }

        // For single/multiple choice, validate against options
        if (question.type === 'single' || question.type === 'multiple') {
            const validValues = question.options.map(opt => opt.value);
            const valuesToCheck = Array.isArray(value) ? value : [value];

            for (const v of valuesToCheck) {
                if (!validValues.includes(v)) {
                    return { valid: false, error: `Invalid option: ${v}` };
                }
            }

            if (question.type === 'single' && Array.isArray(value) && value.length > 1) {
                return { valid: false, error: 'Only one option can be selected' };
            }
        }

        return { valid: true };
    }

    /**
     * Get flow summary for display
     */
    getFlowSummary() {
        return {
            title: this.flow.title,
            slug: this.flow.slug,
            description: this.flow.description,
            icon: this.flow.icon,
            category: this.flow.category,
            totalQuestions: this.flow.questions.length,
            estimatedTimeMinutes: Math.ceil(this.flow.avgTimeSeconds / 60) || 3
        };
    }
}
