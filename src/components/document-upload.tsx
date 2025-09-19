'use client';

import { useFormStatus } from 'react-dom';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Loader2, AlertCircle, X } from 'lucide-react';

export function DocumentUpload({ error }: { error?: string }) {
  const { pending } = useFormStatus();
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a new FileList to assign to the input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      
      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
      }
      setFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      inputRef.current?.click();
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Upload Your Document</CardTitle>
        <CardDescription>Upload a PDF or DOCX file to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            aria-label="File upload area"
            className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={handleKeyDown}
          >
            <Input
              ref={inputRef}
              id="document"
              name="document"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={pending}
            />
            {file ? (
              <div className="text-center p-4">
                <p className="font-medium break-all" aria-live="polite">File selected: {file.name}</p>
                <p className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  disabled={pending}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <FileUp className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-accent">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF or DOCX (max. 10MB)</p>
              </div>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={!file || pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Document'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
