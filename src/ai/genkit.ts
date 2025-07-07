import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextjs from '@genkit-ai/next';

export const ai = genkit({
  plugins: [googleAI(), nextjs()],
  model: 'googleai/gemini-2.0-flash',
});
