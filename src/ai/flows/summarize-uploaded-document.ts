// SummarizeUploadedDocument.ts
'use server';

/**
 * @fileOverview Summarizes key points from an uploaded legal document.
 *
 * - summarizeUploadedDocument - A function that summarizes the uploaded legal document.
 * - SummarizeUploadedDocumentInput - The input type for the summarizeUploadedDocument function.
 * - SummarizeUploadedDocumentOutput - The return type for the summarizeUploadedDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUploadedDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the legal document to summarize.'),
});
export type SummarizeUploadedDocumentInput = z.infer<
  typeof SummarizeUploadedDocumentInputSchema
>;

const SummarizeUploadedDocumentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key points in the legal document.'),
});
export type SummarizeUploadedDocumentOutput = z.infer<
  typeof SummarizeUploadedDocumentOutputSchema
>;

export async function summarizeUploadedDocument(
  input: SummarizeUploadedDocumentInput
): Promise<SummarizeUploadedDocumentOutput> {
  return summarizeUploadedDocumentFlow(input);
}

const summarizeUploadedDocumentPrompt = ai.definePrompt({
  name: 'summarizeUploadedDocumentPrompt',
  input: {schema: SummarizeUploadedDocumentInputSchema},
  output: {schema: SummarizeUploadedDocumentOutputSchema},
  prompt: `Summarize the key points of the following legal document. Be concise and clear.

Document Text:
{{{documentText}}}`,
});

const summarizeUploadedDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeUploadedDocumentFlow',
    inputSchema: SummarizeUploadedDocumentInputSchema,
    outputSchema: SummarizeUploadedDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeUploadedDocumentPrompt(input);
    return output!;
  }
);
