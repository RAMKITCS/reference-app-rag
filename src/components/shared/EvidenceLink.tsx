import { motion } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Evidence {
  text: string;
  source: string;
  relevance: number;
}

interface EvidenceLinkProps {
  evidence: Evidence;
  index: number;
  onClick?: () => void;
  className?: string;
}

export function EvidenceLink({ evidence, index, onClick, className }: EvidenceLinkProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        'group flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-all duration-200',
        'hover:border-primary/50 hover:bg-primary/5 hover:shadow-md',
        className
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <FileText className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {evidence.source}
          </span>
          <span className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
            evidence.relevance >= 0.8 && 'bg-success/20 text-success',
            evidence.relevance >= 0.5 && evidence.relevance < 0.8 && 'bg-primary/20 text-primary',
            evidence.relevance < 0.5 && 'bg-muted text-muted-foreground'
          )}>
            {Math.round(evidence.relevance * 100)}%
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {evidence.text}
        </p>
      </div>
      
      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.button>
  );
}
