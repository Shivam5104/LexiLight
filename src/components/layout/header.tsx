import { Scale } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground transition-opacity hover:opacity-80">
          <Scale className="h-6 w-6 text-primary" />
          <span>Legalese Decoder</span>
        </Link>
      </div>
    </header>
  );
}
