'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/resource-finder.ts';
import '@/ai/flows/study-group-assistant.ts';
import '@/ai/flows/study-buddy.ts';
import '@/ai/flows/quiz-generator.ts';
import '@/ai/flows/course-creator.ts';
import '@/ai/flows/video-generator.ts';
