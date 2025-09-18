'use server';

/**
 * @fileOverview Explains legal jargon in plain language.
 *
 * - explainLegalJargon - A function that takes legal text and explains the jargon.
 * - ExplainLegalJargonInput - The input type for the explainLegalJargon function.
 * - ExplainLegalJargonOutput - The return type for the explainLegalJargon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainLegalJargonInputSchema = z.object({
  legalText: z
    .string()
    .describe('The legal text to be explained, potentially containing jargon.'),
});
export type ExplainLegalJargonInput = z.infer<typeof ExplainLegalJargonInputSchema>;

const ExplainLegalJargonOutputSchema = z.object({
  plainLanguageExplanation: z
    .string()
    .describe('The legal jargon explained in plain, easy-to-understand language.'),
});
export type ExplainLegalJargonOutput = z.infer<typeof ExplainLegalJargonOutputSchema>;

export async function explainLegalJargon(input: ExplainLegalJargonInput): Promise<ExplainLegalJargonOutput> {
  return explainLegalJargonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainLegalJargonPrompt',
  input: {schema: ExplainLegalJargonInputSchema},
  output: {schema: ExplainLegalJargonOutputSchema},
  prompt: `You are a legal expert skilled at simplifying complex legal jargon into plain language.

  Please explain the following legal text in a way that is easy to understand for someone with no legal background:

  {{{legalText}}}`,
});

const explainLegalJargonFlow = ai.defineFlow(
  {
    name: 'explainLegalJargonFlow',
    inputSchema: ExplainLegalJargonInputSchema,
    outputSchema: ExplainLegalJargonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
