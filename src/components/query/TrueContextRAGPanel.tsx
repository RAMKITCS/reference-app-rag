import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Coins,
  FileText,
  Loader2,
  CheckCircle2,
  Shield,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QualityGauge } from '@/components/shared/QualityGauge';
import { cn } from '@/lib/utils';

interface QualityDimension {
  name: string;
  score: number;
  threshold: number;
}

interface TrueContextRAGPanelProps {
  isLoading: boolean;
  response?: string;
  metrics?: {
    tokensInput: number;
    tokensOutput: number;
    cost: number;
    time: number;
    chunksSelected: number;
    chunksCandidates: number;
    budgetUsed: number;
    budgetTotal: number;
  };
  quality?: {
    overall: number;
    attempts: number;
    dimensions: QualityDimension[];
  };
  evidence?: { text: string; source: string; relevance: number }[];
}

export function TrueContextRAGPanel({
  isLoading,
  response,
  metrics,
  quality,
  evidence,
}: TrueContextRAGPanelProps) {
  return (
    <Card className="h-full border-success/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-success" />
          TrueContext AI
          {quality && quality.overall >= 0.85 && (
            <Trophy className="h-4 w-4 text-warning ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <Shield className="h-4 w-4 text-success absolute -right-1 -bottom-1" />
            </div>
            <p className="text-muted-foreground mt-4">Quality-first retrieval in progress...</p>
            <p className="text-xs text-muted-foreground mt-1">
              Validating context quality before generation
            </p>
          </div>
        ) : response ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Quality Dashboard */}
            {quality && (
              <div className="flex items-center gap-4 rounded-lg border border-success/30 bg-success/5 p-4">
                <QualityGauge score={quality.overall} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Quality Gate Passed</span>
                    <span className="text-xs text-muted-foreground">
                      (Attempt {quality.attempts})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {quality.dimensions.slice(0, 3).map((dim) => (
                      <div key={dim.name} className="text-center">
                        <p className="text-xs text-muted-foreground">{dim.name}</p>
                        <p
                          className={cn(
                            'text-sm font-semibold',
                            dim.score >= dim.threshold ? 'text-success' : 'text-warning'
                          )}
                        >
                          {Math.round(dim.score * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Response */}
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <p className="text-sm whitespace-pre-wrap">{response}</p>
            </div>

            {/* Metrics */}
            {metrics && (
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <p className="text-sm font-semibold">{metrics.time.toFixed(2)}s</p>
                  <p className="text-xs text-muted-foreground">Time</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <p className="text-sm font-semibold">
                    {metrics.chunksSelected}/{metrics.chunksCandidates}
                  </p>
                  <p className="text-xs text-muted-foreground">Chunks</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <p className="text-sm font-semibold">
                    {Math.round((metrics.budgetUsed / metrics.budgetTotal) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-2 text-center">
                  <p className="text-sm font-semibold text-success">
                    ${metrics.cost.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground">Cost</p>
                </div>
              </div>
            )}

            {/* Evidence */}
            {evidence && evidence.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-success">Validated Evidence:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-success/20 bg-success/5 p-3 text-sm"
                    >
                      <p className="line-clamp-2">{ev.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{ev.source}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                          {Math.round(ev.relevance * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
            <p className="text-muted-foreground">
              Enter a query to see TrueContext AI results
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Quality-first retrieval with budget optimization
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
