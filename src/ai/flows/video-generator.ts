
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
  studentInterest: z.enum(['Sports', 'Gaming', 'Music', 'Books/Stories']).describe("A student's primary interest to be used for analogies."),
  languagePreference: z.enum(['English', 'Amharic', 'Afaan Oromo', 'Somali', 'Tigrinya', 'Arabic']).describe('The target language for all generated content.'),
});
export type VideoGeneratorInput = z.infer<typeof VideoGeneratorInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe("The localized text of the quiz question."),
    options: z.array(z.string()).describe("An array of 4 possible localized answers."),
    correctAnswer: z.string().describe("The correct localized answer from the options."),
    explanation: z.string().describe("A brief, localized explanation of the correct answer."),
});

const VideoGeneratorOutputSchema = z.object({
  videoScript: z.string().describe("A 5-minute video script in the chosen persona, localized to the student's language preference."),
  summaryNotes: z.string().describe("A concise (<=250 words) summary of the key learning objectives, localized to the student's language preference."),
  quizQuestions: z.array(QuizQuestionSchema).describe("An array of 3-5 quiz questions, using examples from the chosen persona's theme, localized to the student's language preference."),
});
export type VideoGeneratorOutput = z.infer<typeof VideoGeneratorOutputSchema>;

export async function generateVideoContent(input: VideoGeneratorInput): Promise<VideoGeneratorOutput> {
  return videoGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'videoGeneratorPrompt',
  input: {schema: VideoGeneratorInputSchema},
  output: {schema: VideoGeneratorOutputSchema},
  prompt: `You are StudyBuddy AI — a multilingual educational content creator that adapts lessons to each student's interest, culture, and preferred language.

Input:
- Teacher Lesson Text: {{{lessonText}}}
- Subject: {{{subject}}}
- Student Interest: {{{studentInterest}}}
- Language Preference: {{{languagePreference}}}

Goal:
Generate a personalized learning experience for the student that includes:
1. A 5-minute video script (fun, engaging, and educational)
2. A concise summary (≤250 words)
3. A 3–5 question quiz

Follow these steps carefully:

1. **Interpret the Lesson**
   - Extract the key learning objectives and make sure you understand what the teacher is trying to convey.
   - Simplify complex concepts without losing technical accuracy.

2. **Adapt the Persona Style**
   Use the following tone and examples based on the student's interest:

   - If {student_interest_bucket} = **Sports**:
     Style: “Coach Leo” — motivational, energetic, uses football or basketball analogies.
     Cultural notes: mention Ethiopian sports, local teams, and relatable athlete moments.
     Example vibe: “Think of calculus like planning your next move in a tight game.”

   - If {student_interest_bucket} = **Gaming**:
     Style: “Pixel” — witty gamer tone, level-up metaphors, short dialogue bursts.
     Cultural notes: reference global and local popular games (FIFA Mobile, PUBG, etc.).
     Example vibe: “Solving this equation is like beating the boss level—you just need the right combo.”

   - If {student_interest_bucket} = **Music**:
     Style: “Melody” — rhythmic, lyrical, turns logic into flow.
     Cultural notes: use music metaphors, references to Ethiopian and international artists.
     Example vibe: “Each formula is a beat in your learning symphony.”

   - If {student_interest_bucket} = **Books/Stories**:
     Style: “Narrator Missy” — storytelling, cinematic, emotional.
     Cultural notes: include Ethiopian folk storytelling or Qur’anic-style narrative tones.
     Example vibe: “In the kingdom of Algebra, brave variables set out to find their values.”

3. **Generate the Lesson Outputs**
   a. **Video Script (max 5 minutes):**
      - Engaging, interactive tone.
      - Include one quick check-in question or activity mid-script.
      - Use metaphors that match the chosen interest.

   b. **Summary Notes (≤250 words):**
      - Bullet or short-paragraph format.
      - Highlight the main ideas in a clear, friendly way.

   c. **Quiz (3–5 questions):**
      - Multiple-choice or short-answer.
      - Use the same vibe as the video script.
      - Include an answer key.

4. **Language and Cultural Adaptation**
   - Translate and localize naturally into {{{languagePreference}}}.
   - Do NOT use direct translation; rewrite idioms and jokes to make sense in the local culture.
   - Keep humor, clarity, and cultural respect for Ethiopian students.
   - Preserve all math/science correctness across languages.

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
