'use server';
/**
 * @fileoverview This file is the entrypoint for all Genkit flow requests.
 */

import { nextJSHandler } from '@genkit-ai/next';
import '@/ai/flows/resource-finder';
import '@/ai/flows/study-group-assistant';
import '@/ai/flows/study-buddy';
import '@/ai/flows/quiz-generator';
import '@/ai/flows/course-creator';
import '@/ai/flows/video-generator';
import { ai } from '@/ai/genkit';

export const POST = nextJSHandler(ai);
