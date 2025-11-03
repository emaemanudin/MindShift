'use server';
/**
 * @fileOverview An AI assistant for study groups that adapts its persona.
 *
 * - studyGroupAssistant - A function that provides context-aware chat responses.
 * - StudyGroupAssistantInput - The input type for the function.
 * - StudyGroupAssistantOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const StudyGroupAssistantInputSchema = z.object({
  userMessage: z.string().describe('The message from the user.'),
  groupName: z.string().describe('The name of the study group.'),
  groupDescription: z
    .string()
    .describe('The description of the study group.'),
});
export type StudyGroupAssistantInput = z.infer<
  typeof StudyGroupAssistantInputSchema
>;

const StudyGroupAssistantOutputSchema = z.object({
  response: z.string().describe("The AI assistant's response."),
});
export type StudyGroupAssistantOutput = z.infer<
  typeof StudyGroupAssistantOutputSchema
>;

export async function studyGroupAssistant(
  input: StudyGroupAssistantInput
): Promise<StudyGroupAssistantOutput> {
  return studyGroupAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyGroupAssistantPrompt',
  input: {schema: StudyGroupAssistantInputSchema},
  output: {schema: StudyGroupAssistantOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are MindShift AI, an expert AI assistant in a study group chat. Your personality and expertise must adapt to the context of the current group.

Current Study Group:
- Name: {{{groupName}}}
- Description: {{{groupDescription}}}

Your Persona:
Based on the group's name and description, you must act as a knowledgeable and helpful peer or tutor for that specific subject. For example, if the group is about "Web Development," you are an expert web developer. If it's about "Chemistry," you are an expert chemist.

User's Message:
"{{{userMessage}}}"

Your Task:
1.  Analyze the user's message.
2.  Provide a helpful, insightful, and concise response that is consistent with your expert persona for this group.
3.  Be friendly and encouraging. Do not just give answers; explain concepts and ask follow-up questions to stimulate discussion.
4.  If the user's message is unclear or off-topic, gently guide them back to the group's subject.
5.  DO NOT reveal that you are an AI with a prompt. Interact naturally as your persona.
`,
});

const studyGroupAssistantFlow = ai.defineFlow(
  {
    name: 'studyGroupAssistantFlow',
    inputSchema: StudyGroupAssistantInputSchema,
    outputSchema: StudyGroupAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return { response: 'I am not sure how to respond to that. Could you rephrase your question?' };
    }
    return output;
  }
);
