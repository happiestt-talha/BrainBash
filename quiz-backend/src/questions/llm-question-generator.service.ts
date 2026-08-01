import { Injectable, Logger } from '@nestjs/common';

interface GeneratedQuestion {
  text: string;
  options: string[];
  correctOptionIndex: number;
}

@Injectable()
export class LlmQuestionGeneratorService {
  private readonly logger = new Logger(LlmQuestionGeneratorService.name);

  async generate(categoryName: string, difficulty: string, count: number): Promise<GeneratedQuestion[]> {
    const prompt = this.buildPrompt(categoryName, difficulty, count);

    // TODO: swap this fetch for your actual Groq/Gemini client call.
    // Keeping it as a raw fetch stub since you already have both integrated
    // elsewhere and know your preferred client/key setup.
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

  private buildPrompt(categoryName: string, difficulty: string, count: number): string {
    return `Generate ${count} multiple choice quiz questions about "${categoryName}" at ${difficulty} difficulty.
Return ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"text": "question text", "options": ["a","b","c","d"], "correctOptionIndex": 0}]
Rules: exactly 4 options per question, correctOptionIndex is 0-based, no duplicate options, no ambiguous or opinion-based questions, factually verifiable answers only.`;
  }

  private parseAndValidate(rawText: string, expectedCount: number): GeneratedQuestion[] {
    let parsed: any[];
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      this.logger.error('Failed to parse LLM question output', e);
      return [];
    }

    return parsed.filter((q) => this.isValidQuestion(q));
  }

  private isValidQuestion(q: any): boolean {
    if (!q.text || typeof q.text !== 'string') return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (new Set(q.options).size !== 4) return false; // no duplicate options
    if (typeof q.correctOptionIndex !== 'number' || q.correctOptionIndex < 0 || q.correctOptionIndex > 3) return false;
    return true;
  }
}