"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LlmQuestionGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmQuestionGeneratorService = void 0;
const common_1 = require("@nestjs/common");
let LlmQuestionGeneratorService = LlmQuestionGeneratorService_1 = class LlmQuestionGeneratorService {
    logger = new common_1.Logger(LlmQuestionGeneratorService_1.name);
    async generate(categoryName, difficulty, count) {
        const prompt = this.buildPrompt(categoryName, difficulty, count);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            }),
        });
        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content ?? '[]';
        return this.parseAndValidate(rawText, count);
    }
    buildPrompt(categoryName, difficulty, count) {
        return `Generate ${count} multiple choice quiz questions about "${categoryName}" at ${difficulty} difficulty.
Return ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"text": "question text", "options": ["a","b","c","d"], "correctOptionIndex": 0}]
Rules: exactly 4 options per question, correctOptionIndex is 0-based, no duplicate options, no ambiguous or opinion-based questions, factually verifiable answers only.`;
    }
    parseAndValidate(rawText, expectedCount) {
        let parsed;
        try {
            const cleaned = rawText.replace(/```json|```/g, '').trim();
            parsed = JSON.parse(cleaned);
        }
        catch (e) {
            this.logger.error('Failed to parse LLM question output', e);
            return [];
        }
        return parsed.filter((q) => this.isValidQuestion(q));
    }
    isValidQuestion(q) {
        if (!q.text || typeof q.text !== 'string')
            return false;
        if (!Array.isArray(q.options) || q.options.length !== 4)
            return false;
        if (new Set(q.options).size !== 4)
            return false;
        if (typeof q.correctOptionIndex !== 'number' || q.correctOptionIndex < 0 || q.correctOptionIndex > 3)
            return false;
        return true;
    }
};
exports.LlmQuestionGeneratorService = LlmQuestionGeneratorService;
exports.LlmQuestionGeneratorService = LlmQuestionGeneratorService = LlmQuestionGeneratorService_1 = __decorate([
    (0, common_1.Injectable)()
], LlmQuestionGeneratorService);
//# sourceMappingURL=llm-question-generator.service.js.map