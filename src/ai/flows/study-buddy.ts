
'use server';
/**
 * @fileOverview A one-on-one AI tutor that provides text and audio responses.
 *
 * - studyBuddy - A function that provides a helpful response and converts it to speech.
 * - StudyBuddyInput - The input type for the studyBuddy function.
 * - StudyBuddyOutput - The return type for the studyBuddy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/google-genai';

const StudyBuddyInputSchema = z.object({
  question: z.string().describe("The user's question for the study buddy."),
  subject: z.string().describe('The academic subject of the question (e.g., Math, Science).'),
  complexity: z.string().describe('The desired complexity of the explanation (e.g., Middle School, High School, University).'),
  language: z.string().describe('The language in which to provide the explanation.'),
});
export type StudyBuddyInput = z.infer<typeof StudyBuddyInputSchema>;

const StudyBuddyTextOutputSchema = z.object({
  explanation: z.string().describe('A step-by-step explanation of the topic.'),
  examples: z.array(z.string()).describe('2-3 practical examples to illustrate the concept.'),
  misconceptions: z.array(z.string()).describe('Common misconceptions about the topic.'),
});

const StudyBuddyOutputSchema = StudyBuddyTextOutputSchema.extend({
  audioDataUri: z.string().describe('The AI\'s spoken answer as a WAV audio data URI.'),
});
export type StudyBuddyOutput = z.infer<typeof StudyBuddyOutputSchema>;

export async function studyBuddy(input: StudyBuddyInput): Promise<StudyBuddyOutput> {
  return studyBuddyFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'studyBuddyTextPrompt',
  input: { schema: StudyBuddyInputSchema },
  output: { schema: StudyBuddyTextOutputSchema },
  model: googleAI.model('gemini-1.5-flash'),
  prompt: `You are MindShift, an expert AI tutor. Your goal is to provide clear, personalized academic support by explaining topics to students.

Your Task:
Analyze the user's question within the given subject, and generate a response tailored to the specified complexity level and language. Your response MUST be in a structured JSON format.

- User's Question: {{{question}}}
- Subject: {{{subject}}}
- Complexity Level: {{{complexity}}}
- Language for Explanation: {{{language}}}

Your response must include:
1.  "explanation": A step-by-step explanation of the topic, suitable for the specified complexity level and language. Use analogies and simple terms where appropriate.
2.  "examples": An array of 2 to 3 practical, real-world examples that illustrate the concept.
3.  "misconceptions": An array of common misconceptions related to the topic to help the student avoid them.

DO NOT just give the answer to homework. Instead, explain the concept so the user can solve it themselves. For example, if asked "What is 2+2?", explain what addition is. If asked for an essay, provide an outline and key points instead.`,
});

// Helper function to convert PCM data to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const studyBuddyFlow = ai.defineFlow(
  {
    name: 'studyBuddyFlow',
    inputSchema: StudyBuddyInputSchema,
    outputSchema: StudyBuddyOutputSchema,
  },
  async (input) => {
    // 1. Generate the structured text response
    const {output: structuredResponse} = await textGenerationPrompt(input);
    if (!structuredResponse) {
        throw new Error('Failed to generate structured text response.');
    }
    
    // 2. Combine the structured text for audio generation
    const fullTextForAudio = `
      Here is the explanation for your question about ${input.question}.
      ${structuredResponse.explanation}.
      Now, here are a few examples: ${structuredResponse.examples.join('; ')}.
      Finally, let's cover some common misconceptions: ${structuredResponse.misconceptions.join('; ')}.
    `;
    
    // 3. Generate the audio response from the combined text
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A friendly, clear voice
          },
        },
      },
      prompt: fullTextForAudio,
    });

    if (!media) {
      throw new Error('Failed to generate audio response.');
    }

    // 4. Convert PCM to WAV
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      explanation: structuredResponse.explanation,
      examples: structuredResponse.examples,
      misconceptions: structuredResponse.misconceptions,
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
