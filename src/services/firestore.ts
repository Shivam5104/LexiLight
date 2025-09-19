'use server';

import {
  summarizeUploadedDocument,
} from '@/ai/flows/summarize-uploaded-document';
import {
  explainLegalJargon,
  ExplainLegalJargonInput,
} from '@/ai/flows/explain-legal-jargon';
import {
  answerDocumentQuestions,
  AnswerDocumentQuestionsInput,
} from '@/ai/flows/answer-document-questions';
import { translateText, TranslateTextInput } from '@/ai/flows/translate-text';
import { generateAudioSummary, GenerateAudioSummaryInput } from '@/ai/flows/generate-audio-summary';
import mammoth from 'mammoth';

export interface DocumentAnalysisState {
  summary?: string;
  documentText?: string;
  error?: string;
}

const initialState: DocumentAnalysisState = {
  summary: undefined,
  documentText: undefined,
  error: undefined,
};


export async function analyzeDocument(
  prevState: DocumentAnalysisState,
  formData: FormData
): Promise<DocumentAnalysisState> {
  // Handle reset
  if (formData.get('reset')) {
    return initialState;
  }

  const file = formData.get('document') as File;

  if (!file || file.size === 0) {
    return { error: 'Please upload a document.' };
  }

  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file type. Please upload a PDF or DOCX file.' };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    let documentText = '';

    if (file.type === 'application/pdf') {
      const pdf = (await import('pdf-parse')).default;
      const data = await pdf(buffer);
      documentText = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const { value } = await mammoth.extractRawText({ buffer });
      documentText = value;
    }

    if (!documentText.trim()) {
      return { error: 'Could not extract text from the document. It might be empty or a scanned image.' };
    }
    
    const { summary } = await summarizeUploadedDocument({ documentText });

    return { summary, documentText };
  } catch (e) {
    console.error(e);
    // This is a common error for password-protected PDFs.
    if (e instanceof Error && e.message.includes('PasswordException')) {
      return { error: 'The PDF is password-protected. Please upload a document without a password.' };
    }
    return { error: 'An error occurred while processing the document.' };
  }
}

export async function explainJargon(input: ExplainLegalJargonInput) {
  try {
    const { plainLanguageExplanation } = await explainLegalJargon(input);
    return { explanation: plainLanguageExplanation };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to explain jargon.' };
  }
}

export async function answerQuestion(input: AnswerDocumentQuestionsInput) {
  try {
    const { answer } = await answerDocumentQuestions(input);
    return { answer };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to answer question.' };
  }
}

export async function translate(input: TranslateTextInput) {
  try {
    const { translation } = await translateText(input);
    return { translation };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to translate text.' };
  }
}

export async function generateAudio(input: GenerateAudioSummaryInput) {
  try {
    const { audioDataUri } = await generateAudioSummary(input);
    return { audioDataUri };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate audio.' };
  }
}