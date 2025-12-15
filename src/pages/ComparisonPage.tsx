import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  Trophy,
  GitCompare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { ModelSelector } from '@/components/query/ModelSelector';
import { ComparisonMetric } from '@/components/shared/ComparisonMetric';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'pending';
}

function StepIndicator({
  step,
  isActive,
  isComplete,
}: {
  step: Step;
  isActive: boolean;
  isComplete: boolean;
}) {
  const statusIcons = {
    success: <CheckCircle2 className="h-4 w-4 text-success" />,
    warning: <AlertTriangle className="h-4 w-4 text-warning" />,
    error: <X className="h-4 w-4 text-destructive" />,
    pending: <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3 transition-all',
        isActive && 'border-primary/50 bg-primary/5',
        isComplete && step.status === 'success' && 'border-success/30 bg-success/5',
        isComplete && step.status === 'warning' && 'border-warning/30 bg-warning/5',
        isComplete && step.status === 'error' && 'border-destructive/30 bg-destructive/5',
        !isActive && !isComplete && 'opacity-50'
      )}
    >
      {isComplete ? (
        statusIcons[step.status]
      ) : isActive ? (
        <Loader2 className="h-4 w-4 text-primary animate-spin" />
      ) : (
        <div className="h-4 w-4" />
      )}
      <div>
        <p className="font-medium text-sm">{step.title}</p>
        <p className="text-xs text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function ComparisonPage() {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('azure-gpt-4.1-mini');
  const [isRunning, setIsRunning] = useState(false);
  const [standardStep, setStandardStep] = useState(-1);
  const [truecontextStep, setTruecontextStep] = useState(-1);
  const [showResults, setShowResults] = useState(false);

  const standardSteps: Step[] = [
    { title: 'Retrieval', description: 'Fetching top-k chunks by similarity', status: 'success' },
    { title: 'Coverage Check', description: 'Coverage: 42% - Below threshold', status: 'warning' },
    { title: 'Coherence Check', description: 'Coherence: 35% - Poor context flow', status: 'error' },
    { title: 'Generation', description: 'Generating response with gaps', status: 'warning' },
  ];

  const truecontextSteps: Step[] = [
    { title: 'Budget Optimization', description: 'Allocating tokens by quality weight', status: 'success' },
    { title: 'Quality Gate (Attempt 1)', description: 'Coverage 68%, Coherence 72% - RETRY', status: 'warning' },
    { title: 'Auto-Correction', description: 'Adding context chunks, rebalancing', status: 'success' },
    { title: 'Quality Gate (Attempt 2)', description: 'All dimensions PASSED ✓', status: 'success' },
    { title: 'Generation', description: 'High-quality response with citations', status: 'success' },
  ];

  const runComparison = async () => {
    if (!query.trim() || isRunning) return;

    setIsRunning(true);
    setShowResults(false);
    setStandardStep(-1);
    setTruecontextStep(-1);

    // Animate standard steps
    for (let i = 0; i < standardSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setStandardStep(i);
    }

    // Animate truecontext steps
    for (let i = 0; i < truecontextSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setTruecontextStep(i);
    }

    await new Promise((r) => setTimeout(r, 300));
    setShowResults(true);
    setIsRunning(false);

    // Confetti for TrueContext win
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.75, y: 0.5 },
      colors: ['#10b981', '#14b8a6', '#0ea5e9'],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <GitCompare className="h-8 w-8 text-primary" />
            Side-by-Side Comparison
          </h1>
          <p className="text-muted-foreground">
            Compare Standard RAG vs TrueContext AI in real-time
          </p>
        </motion.div>

        {/* Query Input */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your query to compare both approaches..."
                rows={2}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <div className="flex flex-col gap-2 w-56">
                <ModelSelector value={selectedModel} onChange={setSelectedModel} />
                <Button onClick={runComparison} disabled={!query.trim() || isRunning}>
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Run Comparison
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Split View */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Standard RAG */}
          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Standard RAG
                {showResults && (
                  <span className="ml-auto text-sm px-2 py-1 rounded-full bg-destructive/20 text-destructive">
                    42% Quality
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatePresence>
                {standardSteps.map((step, i) => (
                  <StepIndicator
                    key={i}
                    step={step}
                    isActive={standardStep === i}
                    isComplete={standardStep > i}
                  />
                ))}
              </AnimatePresence>

              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-sm text-muted-foreground">
                      Water damage coverage is mentioned in section 4. Some exclusions may apply...
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">Issues:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-destructive" />
                        Missing coverage limits
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-destructive" />
                        Incomplete exclusions
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-3 w-3 text-destructive" />
                        No amendment references
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* TrueContext AI */}
          <Card className="border-success/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-success" />
                TrueContext AI
                {showResults && (
                  <span className="ml-auto text-sm px-2 py-1 rounded-full bg-success/20 text-success flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    94% Quality
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatePresence>
                {truecontextSteps.map((step, i) => (
                  <StepIndicator
                    key={i}
                    step={step}
                    isActive={truecontextStep === i}
                    isComplete={truecontextStep > i}
                  />
                ))}
              </AnimatePresence>

              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                    <p className="text-sm">
                      Under Policy Section 4.2, water damage coverage includes: (1) Sudden and
                      accidental discharge up to $50,000, (2) Storm-related water intrusion with
                      $2,500 deductible. Key exclusions: gradual seepage, flood, maintenance damage.
                      2024 amendment added sewer backup coverage up to $10,000.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-success">Evidence:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        Policy_2024.pdf, Page 12 (94%)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        Coverage_Terms.docx, Section 4.2 (89%)
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metrics Comparison */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-primary" />
                  Metrics Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ComparisonMetric
                    label="Quality Score"
                    baselineValue={0.42}
                    acboValue={0.94}
                    format="percent"
                    higherIsBetter={true}
                  />
                  <ComparisonMetric
                    label="Tokens Used"
                    baselineValue={8500}
                    acboValue={3200}
                    format="tokens"
                    higherIsBetter={false}
                  />
                  <ComparisonMetric
                    label="Coverage"
                    baselineValue={0.42}
                    acboValue={0.95}
                    format="percent"
                    higherIsBetter={true}
                  />
                  <ComparisonMetric
                    label="Coherence"
                    baselineValue={0.35}
                    acboValue={0.92}
                    format="percent"
                    higherIsBetter={true}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
