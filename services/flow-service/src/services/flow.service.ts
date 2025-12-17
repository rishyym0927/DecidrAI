import { IFlow } from '../models/Flow';
import { IFlowSession } from '../models/FlowSession';

/**
 * Flow Service
 * Business logic for flow operations
 */

export class FlowService {
    /**
     * Extract tags from a single answer based on question options
     */
    static extractTagsFromAnswer(
        flow: IFlow,
        questionId: string,
        answerValue: string | string[]
    ): string[] {
        const question = flow.questions.find(q => q.id === questionId);
        if (!question) return [];

        const tags: string[] = [];
        const values = Array.isArray(answerValue) ? answerValue : [answerValue];

        for (const value of values) {
            const option = question.options.find(opt => opt.value === value);
            if (option && option.tags) {
                tags.push(...option.tags);
            }
        }

        // For text type questions, we might want to add the value as a tag
        if (question.type === 'text' && typeof answerValue === 'string' && answerValue.trim()) {
            tags.push(`text:${answerValue.trim().toLowerCase()}`);
        }

        return [...new Set(tags)]; // Remove duplicates
    }

    /**
     * Aggregate all tags from session answers
     */
    static aggregateTags(session: IFlowSession): string[] {
        const allTags: string[] = [];

        for (const answer of session.answers) {
            allTags.push(...answer.tags);
        }

        return [...new Set(allTags)]; // Remove duplicates
    }

    /**
     * Get the next question index based on current answers and conditional logic
     */
    static getNextQuestionIndex(
        flow: IFlow,
        currentIndex: number,
        answers: Array<{ questionId: string; value: string | string[] }>
    ): number {
        // If we're beyond the questions, flow is complete
        if (currentIndex >= flow.questions.length) {
            return -1;
        }

        const currentQuestion = flow.questions[currentIndex];
        if (!currentQuestion) return -1;

        // Find the answer for the current question
        const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

        // Check for conditional logic
        if (currentQuestion.nextQuestionLogic?.conditions && currentAnswer) {
            const answerValue = currentAnswer.value;

            for (const condition of currentQuestion.nextQuestionLogic.conditions) {
                const conditionValues = Array.isArray(condition.answerValue)
                    ? condition.answerValue
                    : [condition.answerValue];
                const matchingValues = Array.isArray(answerValue) ? answerValue : [answerValue];

                const matches = matchingValues.some(v => conditionValues.includes(v));

                if (matches) {
                    if (condition.endFlow) {
                        return -1; // Flow should end
                    }
                    if (condition.skipToQuestionId) {
                        const skipIndex = flow.questions.findIndex(
                            q => q.id === condition.skipToQuestionId
                        );
                        if (skipIndex !== -1) {
                            return skipIndex;
                        }
                    }
                }
            }
        }

        // Default: move to next question
        const nextIndex = currentIndex + 1;
        return nextIndex < flow.questions.length ? nextIndex : -1;
    }

    /**
     * Check if flow is complete based on current question index
     */
    static isFlowComplete(flow: IFlow, currentIndex: number): boolean {
        return currentIndex < 0 || currentIndex >= flow.questions.length;
    }

    /**
     * Get the current question from flow based on index
     */
    static getCurrentQuestion(flow: IFlow, index: number) {
        if (index < 0 || index >= flow.questions.length) {
            return null;
        }
        return flow.questions[index];
    }

    /**
     * Calculate completion percentage
     */
    static calculateProgress(flow: IFlow, answeredCount: number): number {
        if (flow.questions.length === 0) return 100;
        return Math.round((answeredCount / flow.questions.length) * 100);
    }
}
