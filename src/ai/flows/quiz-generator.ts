'use server';
/**
 * @fileOverview An AI-powered quiz generator that creates assessments from documents.
 *
 * - generateQuizFromDocument - A function that converts document text into a structured quiz.
 * - QuizGeneratorInput - The input type for the function.
 * - QuizGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizGeneratorInputSchema = z.object({
  documentContent: z.string().describe('The text content of the document to be converted into a quiz.'),
  questionCount: z.number().describe('The desired number of questions to generate.'),
});
export type QuizGeneratorInput = z.infer<typeof QuizGeneratorInputSchema>;

const QuestionSchema = z.object({
  questionText: z.string().describe('The text of the question.'),
  questionType: z.enum(['mcq', 'tf']).describe("The type of question: Multiple Choice (mcq) or True/False (tf)."),
  options: z.array(z.string()).describe("An array of possible answers. For mcq, this includes the correct answer and distractors. For tf, it is ['True', 'False']."),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

const QuizGeneratorOutputSchema = z.object({
  quizTitle: z.string().describe('A suggested title for the quiz based on the document content.'),
  questions: z.array(QuestionSchema).describe('An array of generated quiz questions.'),
});
export type QuizGeneratorOutput = z.infer<typeof QuizGeneratorOutputSchema>;

export async function generateQuizFromDocument(input: QuizGeneratorInput): Promise<QuizGeneratorOutput> {
  return quizGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  input: {schema: QuizGeneratorInputSchema},
  output: {schema: QuizGeneratorOutputSchema},
  prompt: `You are an expert instructional designer. Your task is to create a quiz from the provided document content.

Analyze the text and generate exactly {{{questionCount}}} questions.
The questions should cover the key concepts in the document.
For each question, provide the following:
- questionText: The question itself.
- questionType: Determine if it's a multiple-choice ('mcq') or true/false ('tf') question.
- options:
  - For 'mcq', provide 4 options: one correct answer and three plausible distractors. The distractors must be relevant but incorrect.
  - For 'tf', provide the options ["True", "False"].
- correctAnswer: The correct option.
- explanation: A concise, one-sentence explanation for the correct answer.

Document Content:
---
{{{documentContent}}}
---

Generate a response in the required JSON format.
`,
});

const quizGeneratorFlow = ai.defineFlow(
  {
    name: 'quizGeneratorFlow',
    inputSchema: QuizGeneratorInputSchema,
    outputSchema: QuizGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate quiz from document.');
    }
    return output;
  }
);
