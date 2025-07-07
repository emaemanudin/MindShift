'use server';
/**
 * @fileOverview An AI-powered course generator from document text.
 *
 * - generateCourseFromDocument - A function that converts document text into a course structure.
 * - CourseCreatorInput - The input type for the function.
 * - CourseCreatorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseCreatorInputSchema = z.object({
  documentContent: z.string().describe('The text content of the document to be converted into a course.'),
});
export type CourseCreatorInput = z.infer<typeof CourseCreatorInputSchema>;

const QuestionSchema = z.object({
  questionText: z.string().describe("The text of the question."),
  options: z.array(z.string()).describe("An array of 4 possible answers: one correct, three incorrect."),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

const CourseCreatorOutputSchema = z.object({
  title: z.string().describe('A concise and engaging title for the course based on the document content.'),
  description: z.string().describe('A one-paragraph summary of the course content, suitable for a course card.'),
  coverImageAiHint: z.string().describe('Two keywords for a stock photo that represents the course. e.g., "computer science" or "history book"'),
  youtubeVideo: z.object({
    title: z.string().describe('The official title of the suggested YouTube video.'),
    url: z.string().url().describe('The full URL of the suggested YouTube video. It must be a valid, existing video.'),
  }),
  quiz: z.object({
    quizTitle: z.string().describe('A title for the self-assessment quiz.'),
    questions: z.array(QuestionSchema).describe('An array of 3 to 5 multiple-choice quiz questions based on the document.'),
  }),
});
export type CourseCreatorOutput = z.infer<typeof CourseCreatorOutputSchema>;

export async function generateCourseFromDocument(input: CourseCreatorInput): Promise<CourseCreatorOutput> {
  return courseCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseCreatorPrompt',
  input: {schema: CourseCreatorInputSchema},
  output: {schema: CourseCreatorOutputSchema},
  prompt: `You are an expert curriculum designer. Your task is to create a mini-course from the provided document content.

Analyze the text and generate a complete course package.
The package must include:
1.  A short, engaging 'title' for the course.
2.  A one-paragraph 'description' summarizing the key learning objectives.
3.  A 'coverImageAiHint' containing two keywords for a relevant background image.
4.  A 'youtubeVideo' object containing the title and a valid, real URL to a relevant YouTube video that supplements the content.
5.  A 'quiz' object containing:
    - A 'quizTitle' for a self-assessment.
    - An array of 3-5 multiple-choice 'questions' based on the content. Each question must have 'questionText', an array of 4 'options' (1 correct, 3 plausible distractors), the 'correctAnswer', and a brief 'explanation'.

Document Content:
---
{{{documentContent}}}
---

Generate a response in the required JSON format.
`,
});

const courseCreatorFlow = ai.defineFlow(
  {
    name: 'courseCreatorFlow',
    inputSchema: CourseCreatorInputSchema,
    outputSchema: CourseCreatorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate course from document.');
    }
    return output;
  }
);
