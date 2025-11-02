'use server';
/**
 * @fileOverview An AI-powered educational video content generator.
 *
 * - generateVideoContent - A function that creates a video script, summary, and quiz from lesson text.
 * - VideoGeneratorInput - The input type for the function.
 * - VideoGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VideoGeneratorInputSchema = z.object({
  lessonText: z.string().describe('The raw text content of the lesson provided by the teacher.'),
  subject: z.string().describe('The academic subject of the lesson (e.g., Physics, History).'),
  studentInterest: z.string().describe("A student's primary interest to be used for analogies (e.g., Gaming, Music, Art)."),
  languagePreference: z.string().describe('The target language for all generated content (e.g., English, Amharic, Arabic).'),
});
export type VideoGeneratorInput = z.infer<typeof VideoGeneratorInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The localized text of the quiz question."),
    options: z.array(z.string()).describe("An array of 4 possible localized answers."),
    correctAnswer: z.string().describe("The correct localized answer from the options."),
    explanation: z.string().describe("A brief, localized explanation of the correct answer."),
});

const VideoGeneratorOutputSchema = z.object({
  videoScript: z.string().describe("A 5-minute video script in the persona of 'Pixel', using gaming metaphors and an interactive challenge. The script is localized to the student's language preference."),
  summaryNotes: z.string().describe("A concise (<=250 words) summary of the key learning objectives, localized to the student's language preference."),
  quizQuestions: z.array(QuizQuestionSchema).describe("An array of 3-5 quiz questions, localized to the student's language preference."),
});
export type VideoGeneratorOutput = z.infer<typeof VideoGeneratorOutputSchema>;

export async function generateVideoContent(input: VideoGeneratorInput): Promise<VideoGeneratorOutput> {
  return videoGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoGeneratorPrompt',
  input: {schema: VideoGeneratorInputSchema},
  output: {schema: VideoGeneratorOutputSchema},
  prompt: `You are StudyBuddy AI, acting as 'Pixel,' a personalized educational content creator. Your persona is witty, playful, and like a helpful gaming sidekick.

Your Task:
Generate a complete educational content package based on the user's input. Ensure all generated content is high-quality, technically accurate, and localized to the student's preferred language.

Input:
- Lesson Text: {{{lessonText}}}
- Subject: {{{subject}}}
- Student's Primary Interest: {{{studentInterest}}}
- Language Preference: {{{languagePreference}}}

Instructions:
1.  **Analyze**: First, extract the key learning objectives from the provided 'Lesson Text'. These are your 'main quests'.
2.  **Generate Video Script**: Create a 5-minute video script in the 'Pixel' persona.
    - Treat problems and concepts like game levels, bosses, or mechanics.
    - Use gaming metaphors and analogies related to the 'Student's Primary Interest' (e.g., RPGs, strategy games, platformers). If the interest is 'Gaming', feel free to use references from popular global or Ethiopian games (like Gebeta).
    - Include one interactive challenge in the middle of the script (e.g., "Alright, player one! Time for a pop quiz! Can you solve this before the timer runs out? Post your answer in the comments!").
3.  **Generate Summary Notes**: Write a concise summary of the key points (250 words or less), like a 'Quest Log' or 'Patch Notes' for the lesson.
4.  **Generate Quiz Questions**: Create 3 to 5 multiple-choice quiz questions that test understanding of the core concepts, framed as 'mini-bosses' or 'puzzles'.
5.  **Translate & Localize**: Translate ALL content (script, summary, quiz) into the specified 'Language Preference'. The translation must be natural, culturally relevant, and maintain the witty and educational tone.
6.  **Maintain Accuracy**: Ensure all technical details, formulas, and concepts are 100% accurate. No glitches allowed.

Output the entire package in the required JSON format.`,
});

const videoGeneratorFlow = ai.defineFlow(
  {
    name: 'videoGeneratorFlow',
    inputSchema: VideoGeneratorInputSchema,
    outputSchema: VideoGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate video content. The AI may be busy or the input is invalid.');
    }
    return output;
  }
);
