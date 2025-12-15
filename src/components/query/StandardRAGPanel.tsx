import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Coins, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StandardRAGPanelProps {
  isLoading: boolean;
  response?: string;
  metrics?: {
    tokensInput: number;
    tokensOutput: number;
    cost: number;
    time: number;
    chunksRetrieved: number;
    confidence: number;
  };
  evidence?: { text: string; source: string; relevance: number }[];
}

export function StandardRAGPanel({
  isLoading,
  response,
  metrics,
  evidence,
}: StandardRAGPanelProps) {
  return (
    <Card className="h-full border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Standard RAG
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground">Processing with standard retrieval...</p>
          </div>
        ) : response ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Response */}
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>

            {/* Metrics */}
            {metrics && (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{metrics.time.toFixed(2)}s</p>
                  <p className="text-xs text-muted-foreground">Time</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <Coins className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{metrics.tokensInput + metrics.tokensOutput}</p>
                  <p className="text-xs text-muted-foreground">Tokens</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{metrics.chunksRetrieved}</p>
                  <p className="text-xs text-muted-foreground">Chunks</p>
                </div>
              </div>
            )}

            {/* Evidence */}
            {evidence && evidence.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Retrieved Chunks:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card/50 p-3 text-sm"
                    >
                      <p className="text-muted-foreground line-clamp-2">{ev.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ev.source} • {Math.round(ev.relevance * 100)}% relevance
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Enter a query to see Standard RAG results
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Basic semantic search without quality validation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
