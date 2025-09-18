import { config } from 'dotenv';
config();

import '@/ai/flows/answer-document-questions.ts';
import '@/ai/flows/explain-legal-jargon.ts';
import '@/ai/flows/summarize-uploaded-document.ts';