'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering questions about a legal document.
 *
 * It includes:
 * - AnswerDocumentQuestionsInput: The input type for the answerDocumentQuestions function.
 * - AnswerDocumentQuestionsOutput: The output type for the answerDocumentQuestions function.
 * - answerDocumentQuestions: An async function that takes a question and document content as input, and returns an AI-powered answer referencing the document.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDocumentQuestionsInputSchema = z.object({
  documentContent: z.string().describe('The text content of the legal document.'),
  question: z.string().describe('The question to be answered based on the document content.'),
});
export type AnswerDocumentQuestionsInput = z.infer<
  typeof AnswerDocumentQuestionsInputSchema
>;

const AnswerDocumentQuestionsOutputSchema = z.object({
  answer: z.string().describe('The AI-powered answer to the question.'),
});
export type AnswerDocumentQuestionsOutput = z.infer<
  typeof AnswerDocumentQuestionsOutputSchema
>;

export async function answerDocumentQuestions(
  input: AnswerDocumentQuestionsInput
): Promise<AnswerDocumentQuestionsOutput> {
  return answerDocumentQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDocumentQuestionsPrompt',
  input: {schema: AnswerDocumentQuestionsInputSchema},
  output: {schema: AnswerDocumentQuestionsOutputSchema},
  prompt: `You are an AI assistant designed to answer questions about legal documents.  
  Your answers must be based on the content of the document provided.  
  If the answer is not contained in the document, please state that you cannot answer the question.

Document Content:
{{documentContent}}

Question: {{question}}

Answer:`,
});

const answerDocumentQuestionsFlow = ai.defineFlow(
  {
    name: 'answerDocumentQuestionsFlow',
    inputSchema: AnswerDocumentQuestionsInputSchema,
    outputSchema: AnswerDocumentQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
