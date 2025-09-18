'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { answerQuestion, explainJargon, translate } from '@/app/actions';
import { Loader2, Send, Sparkles, Languages } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface DocumentAnalysisProps {
  summary: string;
  documentText: string;
}

type Language = 'English' | 'Hindi';

export function DocumentAnalysis({ summary: initialSummary, documentText }: DocumentAnalysisProps) {
  const [question, setQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [jargonExplanation, setJargonExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [isTranslating, setIsTranslating] = useState(false);

  // Store original and translated content
  const [summary, setSummary] = useState({ English: initialSummary, Hindi: '' });
  const [answer, setAnswer] = useState({ English: '', Hindi: '' });
  
  const qaScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qaScrollAreaRef.current) {
        // A bit of a hack to get the viewport. The component nests the viewport in a div.
        const viewport = qaScrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [answer, isAnswering]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAnswering) return;
    setIsAnswering(true);
    setAnswer({ English: '', Hindi: '' });
    setCurrentQuestion(question);
    const result = await answerQuestion({ documentContent: documentText, question });
    
    let englishAnswer = 'Sorry, I could not find an answer to your question.';
    if (result.answer) {
      englishAnswer = result.answer;
    }
    setAnswer(prev => ({ ...prev, English: englishAnswer }));

    if (language === 'Hindi') {
      const transResult = await translate({ text: englishAnswer, targetLanguage: 'Hindi' });
      if (transResult.translation) {
        setAnswer(prev => ({ ...prev, Hindi: transResult.translation }));
      }
    }

    setIsAnswering(false);
    setQuestion('');
  };
  
  const handleSelectionChange = () => {
    const text = window.getSelection()?.toString() || '';
    if (text.trim().length > 3 && text.trim().length < 300) {
      setSelectedText(text);
    } else {
      setSelectedText('');
    }
  };

  const handleExplainJargon = async () => {
    if (!selectedText) return;
    setIsExplaining(true);
    setJargonExplanation('');
    const result = await explainJargon({ legalText: selectedText });

    let explanation = 'Could not explain the selected text.';
    if (result.explanation) {
      explanation = result.explanation;
    }

    if (language === 'Hindi') {
      const transResult = await translate({ text: explanation, targetLanguage: 'Hindi' });
      setJargonExplanation(transResult.translation || '');
    } else {
      setJargonExplanation(explanation);
    }

    setIsExplaining(false);
  };
  
  const handleLanguageToggle = async (lang: Language) => {
    if (language === lang || isTranslating) return;
    setLanguage(lang);
    setIsTranslating(true);
    
    if (lang === 'Hindi') {
      if (!summary.Hindi) {
        const transResult = await translate({ text: summary.English, targetLanguage: 'Hindi' });
        if (transResult.translation) {
          setSummary(prev => ({...prev, Hindi: transResult.translation}));
        }
      }
    }
    // No need to translate back to English as we keep the original.

    setIsTranslating(false);
  }

  const displayedSummary = isTranslating ? 'Translating...' : (language === 'Hindi' && summary.Hindi) ? summary.Hindi : summary.English;
  const displayedAnswer = isTranslating && language ==='Hindi' ? 'Translating...' : (language === 'Hindi' && answer.Hindi) ? answer.Hindi : answer.English;

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="p-6 pb-0 flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-foreground">Document Analysis</h3>
        <div className="flex items-center gap-2">
            <Button variant={language === 'English' ? 'secondary': 'ghost'} size="sm" onClick={() => handleLanguageToggle('English')} disabled={isTranslating}>English</Button>
            <Button variant={language === 'Hindi' ? 'secondary': 'ghost'} size="sm" onClick={() => handleLanguageToggle('Hindi')} disabled={isTranslating}>हिन्दी</Button>
        </div>
      </div>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none m-0 mt-4">
            <TabsTrigger value="summary">Key Points</TabsTrigger>
            <TabsTrigger value="qa">Q&amp;A</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="p-6 bg-card m-0">
              <Popover onOpenChange={(open) => {
                if (!open) {
                  setSelectedText('');
                  setJargonExplanation('');
                }
              }}>
                <PopoverTrigger asChild>
                  <ScrollArea 
                    className="h-96 rounded-md border p-4 bg-background whitespace-pre-wrap selection:bg-primary/30" 
                    onMouseUp={handleSelectionChange}
                    onTouchEnd={handleSelectionChange}
                  >
                    {isTranslating && <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                    {!isTranslating && displayedSummary}
                  </ScrollArea>
                </PopoverTrigger>
                {selectedText && (
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Explain Jargon</h4>
                        <p className="text-sm text-muted-foreground">
                          Get a simple explanation for the selected text.
                        </p>
                      </div>
                       <p className="text-sm border-l-2 border-primary pl-2 italic text-muted-foreground">"{selectedText}"</p>
                      {isExplaining && (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      )}
                      {jargonExplanation && !isExplaining && (
                         <div className="text-sm space-y-2">
                            <p className="font-semibold text-accent">Explanation:</p>
                            <p className="text-foreground">{jargonExplanation}</p>
                         </div>
                      )}
                      {!jargonExplanation && !isExplaining && (
                        <Button onClick={handleExplainJargon}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Explain
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                )}
             </Popover>
              <p className="text-xs text-muted-foreground mt-2">Select any word or phrase in the summary to get an explanation.</p>
          </TabsContent>
          
          <TabsContent value="qa" className="p-6 bg-card m-0">
            <div className="flex flex-col h-[28rem]">
              <ScrollArea className="flex-1 w-full pr-4" ref={qaScrollAreaRef}>
                 <div className="flex flex-col gap-4">
                    {!answer.English && !isAnswering && (
                      <div className="flex items-center justify-center h-full text-center">
                        <p className="text-muted-foreground">Ask a question about your document to get started.</p>
                      </div>
                    )}

                    {answer.English && (
                      <>
                        <div className="bg-muted p-3 rounded-lg self-end max-w-[80%]">
                          <p className="font-semibold text-sm">You</p>
                          <p className="text-sm text-muted-foreground">{currentQuestion}</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg self-start max-w-[80%]">
                          <p className="font-semibold text-primary text-sm">AI Assistant</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{displayedAnswer}</p>
                        </div>
                      </>
                    )}
                    {isAnswering && (
                        <>
                        <div className="bg-muted p-3 rounded-lg self-end max-w-[80%]">
                          <p className="font-semibold text-sm">You</p>
                          <p className="text-sm text-muted-foreground">{currentQuestion}</p>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg self-start max-w-[80%]">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Thinking...</p>
                        </div>
                      </>
                    )}
                 </div>
              </ScrollArea>
              
              <Separator className="my-4" />

              <form onSubmit={handleQuestionSubmit} className="flex gap-2 items-start">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about your document..."
                  className="flex-1 bg-background"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleQuestionSubmit(e);
                    }
                  }}
                  disabled={isAnswering}
                />
                <Button type="submit" size="icon" disabled={isAnswering || !question.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
    </Card>
  );
}
