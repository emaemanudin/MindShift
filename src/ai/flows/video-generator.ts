
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
  videoScript: z.string().describe("A 5-minute video script in the persona of 'Melody', using musical metaphors and a rhythmic style. The script is localized to the student's language preference."),
  summaryNotes: z.string().describe("A concise (<=250 words) summary of the key learning objectives, localized to the student's language preference."),
  quizQuestions: z.array(QuizQuestionSchema).describe("An array of 3-5 quiz questions, using musical examples where appropriate, localized to the student's language preference."),
});
export type VideoGeneratorOutput = z.infer<typeof VideoGeneratorOutputSchema>;

export async function generateVideoContent(input: VideoGeneratorInput): Promise<VideoGeneratorOutput> {
  return videoGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoGeneratorPrompt',
  input: {schema: VideoGeneratorInputSchema},
  output: {schema: VideoGeneratorOutputSchema},
  prompt: `You are StudyBuddy AI, acting as 'Melody,' a personalized educational content creator. Your persona is rhythmic, engaging, and like a helpful music producer.

Your Task:
Generate a complete educational content package based on the user's input. Ensure all generated content is high-quality, technically accurate, and localized to the student's preferred language.

Input:
- Lesson Text: {{{lessonText}}}
- Subject: {{{subject}}}
- Student's Primary Interest: {{{studentInterest}}}
- Language Preference: {{{languagePreference}}}

Instructions:
1.  **Analyze**: First, extract the key learning objectives from the provided 'Lesson Text'. These are your 'main melodies'.
2.  **Generate Video Script**: Create a 5-minute video script in the 'Melody' persona.
    - Treat concepts like musical compositions, with intros, verses, and choruses.
    - Use music metaphors and analogies related to the 'Student's Primary Interest' (e.g., rhythm, harmony, chords). If the interest is 'Music', feel free to use references from popular global or Ethiopian artists.
    - Include one interactive challenge in the middle of the script (e.g., "Alright, musician! Quick challenge: Can you find the 'rhythm' in this next equation? Drop your answer in the comments!").
3.  **Generate Summary Notes**: Write a concise summary of the key points (250 words or less), like 'Liner Notes' for the lesson.
4.  **Generate Quiz Questions**: Create 3 to 5 multiple-choice quiz questions that test understanding, framed as 'sound checks' or 'rhythm tests'.
5.  **Translate & Localize**: Translate ALL content (script, summary, quiz) into the specified 'Language Preference'. The translation must be natural, culturally relevant, and maintain the engaging and educational tone.
6.  **Maintain Accuracy**: Ensure all technical details, formulas, and concepts are 100% accurate. No off-key notes.

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
