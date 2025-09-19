'use client';

import { useActionState, useTransition } from 'react';
import { analyzeDocument, DocumentAnalysisState } from '@/app/actions';
import { Header } from '@/components/layout/header';
import { DocumentUpload } from '@/components/document-upload';
import { DocumentAnalysis } from '@/components/document-analysis';

const initialState: DocumentAnalysisState = {
  summary: undefined,
  documentText: undefined,
  error: undefined,
};

export default function Home() {
  const [state, formAction] = useActionState(analyzeDocument, initialState);
  const [isResetting, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(() => {
      // A trick to reset the form action state is to call it with a special FormData
      const formData = new FormData();
      formData.append('reset', 'true');
      formAction(formData);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
            Understand Legal Docs in Plain English
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Upload your legal document and our AI will extract key points, explain complex jargon, and answer your questions.
          </p>
        </section>

        <div className="mt-10 max-w-4xl mx-auto">
          <form action={formAction}>
            {(!state.summary && !state.documentText) ? (
                <DocumentUpload error={state.error} />
            ) : (
              <DocumentAnalysis
                summary={state.summary!}
                documentText={state.documentText!}
                onReset={handleReset}
                isResetting={isResetting}
              />
            )}
          </form>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Lexilight. All rights reserved.
      </footer>
    </div>
  );
}
