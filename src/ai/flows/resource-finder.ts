'use server';

/**
 * @fileOverview An AI-powered resource finder for students.
 *
 * - aiResourceFinder - A function that provides links to relevant online learning resources and documentation.
 * - AiResourceFinderInput - The input type for the aiResourceFinder function.
 * - AiResourceFinderOutput - The return type for the aiResourceFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiResourceFinderInputSchema = z.object({
  searchQuery: z.string().describe('The search query for learning resources.'),
});
export type AiResourceFinderInput = z.infer<typeof AiResourceFinderInputSchema>;

const AiResourceFinderOutputSchema = z.object({
  resources: z
    .array(z.object({title: z.string(), url: z.string()}))
    .describe('An array of relevant learning resources.'),
});
export type AiResourceFinderOutput = z.infer<typeof AiResourceFinderOutputSchema>;

export async function aiResourceFinder(input: AiResourceFinderInput): Promise<AiResourceFinderOutput> {
  return aiResourceFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiResourceFinderPrompt',
  input: {schema: AiResourceFinderInputSchema},
  output: {schema: AiResourceFinderOutputSchema},
  prompt: `You are an AI-powered resource finder for students. Based on the search query, provide a list of relevant online learning resources and documentation.

Search Query: {{{searchQuery}}}

Please provide the resources in the following JSON format:
{
  "resources": [
    {
      "title": "Resource Title 1",
      "url": "Resource URL 1"
    },
    {
      "title": "Resource Title 2",
      "url": "Resource URL 2"
    }
  ]
}`,
});

const aiResourceFinderFlow = ai.defineFlow(
  {
    name: 'aiResourceFinderFlow',
    inputSchema: AiResourceFinderInputSchema,
    outputSchema: AiResourceFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
