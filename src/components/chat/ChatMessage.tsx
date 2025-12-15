import { motion } from 'framer-motion';
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  sources?: { source: string; relevance: number }[];
}

export function ChatMessage({ role, content, timestamp, sources }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary' : 'bg-accent'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-accent-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex flex-col gap-2 max-w-[75%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-secondary text-secondary-foreground rounded-bl-md'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>

        {/* Sources for AI messages */}
        {!isUser && sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sources.map((source, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {source.source} ({Math.round(source.relevance * 100)}%)
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {!isUser && (
            <div className="flex items-center gap-1 ml-2">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
