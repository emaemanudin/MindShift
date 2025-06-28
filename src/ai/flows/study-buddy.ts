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
import {googleAI} from '@genkit-ai/googleai';

const StudyBuddyInputSchema = z.string().describe('The user\'s question for the study buddy.');
export type StudyBuddyInput = z.infer<typeof StudyBuddyInputSchema>;

const StudyBuddyOutputSchema = z.object({
  responseText: z.string().describe("The AI's text-based answer."),
  audioDataUri: z.string().describe('The AI\'s spoken answer as a WAV audio data URI.'),
});
export type StudyBuddyOutput = z.infer<typeof StudyBuddyOutputSchema>;

export async function studyBuddy(input: StudyBuddyInput): Promise<StudyBuddyOutput> {
  return studyBuddyFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'studyBuddyTextPrompt',
  input: { schema: z.string() },
  output: { schema: z.string() },
  prompt: `You are MindShift, a friendly and knowledgeable AI Study Buddy. Your goal is to help students understand complex topics by explaining them clearly and concisely. You are talking one-on-one with them.

User's question: {{{prompt}}}

Your Task:
1. Analyze the user's question.
2. Provide a helpful, insightful, and easy-to-understand response.
3. Break down complex ideas into smaller, digestible parts.
4. Keep your tone encouraging and supportive.
5. DO NOT just give the answer to homework. Instead, explain the concept so the user can solve it themselves. For example, if asked "What is 2+2?", explain what addition is. If asked for an essay, provide an outline and key points instead.
`,
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
  async (question) => {
    // 1. Generate the text response
    const {output: textResponse} = await textGenerationPrompt(question);
    if (!textResponse) {
        throw new Error('Failed to generate text response.');
    }
    
    // 2. Generate the audio response from the text
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
      prompt: textResponse,
    });

    if (!media) {
      throw new Error('Failed to generate audio response.');
    }

    // 3. Convert PCM to WAV
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      responseText: textResponse,
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
