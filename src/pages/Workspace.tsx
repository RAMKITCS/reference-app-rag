import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Send,
  Mic,
  FileText,
  Hash,
  Search,
  Network,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Zap,
  GitCompare,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { QualityGauge } from '@/components/shared/QualityGauge';
import { MetricCard } from '@/components/shared/MetricCard';
import { EvidenceLink } from '@/components/shared/EvidenceLink';
import { ComparisonMetric } from '@/components/shared/ComparisonMetric';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

// Comparison step animation component
function ComparisonStep({ 
  step, 
  isActive, 
  isComplete,
  variant 
}: { 
  step: { title: string; description: string; status: 'success' | 'warning' | 'error' | 'pending' };
  isActive: boolean;
  isComplete: boolean;
  variant: 'baseline' | 'acbo';
}) {
  const statusIcons = {
    success: <CheckCircle2 className="h-5 w-5 text-success" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" />,
    error: <X className="h-5 w-5 text-destructive" />,
    pending: <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: variant === 'baseline' ? -20 : 20 }}
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
      {isComplete ? statusIcons[step.status] : isActive ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> : <div className="h-5 w-5" />}
      <div>
        <p className="font-medium text-sm">{step.title}</p>
        <p className="text-xs text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCompareMode = searchParams.get('compare') === 'true';
  
  const { 
    currentQuery, 
    setCurrentQuery, 
    isQuerying, 
    setIsQuerying,
    activeScenario,
    acboEnabled,
    toggleAcbo,
    toggleCompareMode,
    submitFeedback,
    activeResult,
    documents,
  } = useAppStore();

  const [query, setQuery] = useState('');
  const [baselineStep, setBaselineStep] = useState(-1);
  const [acboStep, setAcboStep] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Demo data
  const mockDocuments = [
    { id: '1', name: 'Policy_2024_v3.pdf', chunks: 45 },
    { id: '2', name: 'Coverage_Terms.docx', chunks: 32 },
    { id: '3', name: 'Amendment_Jan2024.pdf', chunks: 18 },
    { id: '4', name: 'Claims_Procedures.md', chunks: 28 },
  ];

  const mockEntities = [
    { name: 'Water Damage', type: 'coverage', count: 12 },
    { name: 'Deductible', type: 'term', count: 8 },
    { name: 'Section 4.2', type: 'reference', count: 5 },
    { name: 'Policy Holder', type: 'party', count: 15 },
  ];

  const baselineSteps = [
    { title: 'Retrieval', description: 'Fetching top-k chunks by similarity', status: 'success' as const },
    { title: 'Coverage Check', description: 'Coverage: 42% - Below threshold', status: 'warning' as const },
    { title: 'Coherence Check', description: 'Coherence: 35% - Poor context flow', status: 'error' as const },
    { title: 'Generation', description: 'Generating response with gaps', status: 'warning' as const },
  ];

  const acboSteps = [
    { title: 'Budget Optimization', description: 'Allocating tokens by quality weight', status: 'success' as const },
    { title: 'Quality Gate (Attempt 1)', description: 'Coverage 68%, Coherence 72% - RETRY', status: 'warning' as const },
    { title: 'Auto-Correction', description: 'Adding context chunks, rebalancing', status: 'success' as const },
    { title: 'Quality Gate (Attempt 2)', description: 'All dimensions PASSED ✓', status: 'success' as const },
    { title: 'Generation', description: 'High-quality response with citations', status: 'success' as const },
  ];

  const mockEvidence = [
    { text: 'Water damage coverage includes sudden and accidental discharge...', source: 'Policy_2024_v3.pdf, Page 12', relevance: 0.94 },
    { text: 'Exclusions apply to gradual seepage and flood conditions...', source: 'Coverage_Terms.docx, Section 4.2', relevance: 0.89 },
    { text: '2024 Amendment: Sewer backup coverage increased to $10,000...', source: 'Amendment_Jan2024.pdf, Page 3', relevance: 0.85 },
  ];

  useEffect(() => {
    if (activeScenario && isCompareMode) {
      setQuery(activeScenario.query);
      runComparison();
    }
  }, [activeScenario, isCompareMode]);

  const runComparison = async () => {
    setIsQuerying(true);
    setShowResults(false);
    setBaselineStep(-1);
    setAcboStep(-1);

    // Animate baseline steps
    for (let i = 0; i < baselineSteps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setBaselineStep(i);
    }

    // Animate ACBO steps
    for (let i = 0; i < acboSteps.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setAcboStep(i);
    }

    await new Promise(r => setTimeout(r, 500));
    setShowResults(true);
    setIsQuerying(false);

    // Trigger confetti for ACBO win
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.75, y: 0.6 },
      colors: ['#0ea5e9', '#06b6d4', '#14b8a6'],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (isCompareMode) {
      runComparison();
    } else {
      setIsQuerying(true);
      setTimeout(() => {
        setShowResults(true);
        setIsQuerying(false);
      }, 2000);
    }
  };

  // Comparison Mode Layout
  if (isCompareMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          {/* Query bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query..."
                    className="w-full h-12 px-4 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button type="submit" size="lg" disabled={isQuerying || !query.trim()}>
                  {isQuerying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Run Comparison
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Split comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Baseline Side */}
            <Card className="border-destructive/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Baseline RAG
                  </CardTitle>
                  {showResults && (
                    <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                      Quality: 42%
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {baselineSteps.map((step, index) => (
                  <ComparisonStep
                    key={index}
                    step={step}
                    isActive={baselineStep === index}
                    isComplete={baselineStep > index}
                    variant="baseline"
                  />
                ))}

                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                      <p className="text-sm text-muted-foreground">
                        {activeScenario?.baselineResult.response || 
                          'Water damage coverage is mentioned in section 4. Some exclusions may apply...'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-destructive">Issues Detected:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <X className="h-4 w-4 text-destructive" />
                          Missing coverage limits
                        </li>
                        <li className="flex items-center gap-2">
                          <X className="h-4 w-4 text-destructive" />
                          Incomplete exclusion list
                        </li>
                        <li className="flex items-center gap-2">
                          <X className="h-4 w-4 text-destructive" />
                          No amendment references
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* ACBO Side */}
            <Card className="border-success/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-success">
                    <Zap className="h-5 w-5" />
                    ACBO
                  </CardTitle>
                  {showResults && (
                    <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      Quality: 94%
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {acboSteps.map((step, index) => (
                  <ComparisonStep
                    key={index}
                    step={step}
                    isActive={acboStep === index}
                    isComplete={acboStep > index}
                    variant="acbo"
                  />
                ))}

                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                      <p className="text-sm">
                        {activeScenario?.acboResult.response || 
                          'Under Policy Section 4.2, water damage coverage includes: (1) Sudden and accidental discharge from plumbing systems up to $50,000, (2) Storm-related water intrusion with $2,500 deductible. Key exclusions: gradual seepage, flood (requires separate policy), and damage from lack of maintenance. The 2024 amendment (Doc 3, pg 12) added coverage for backup of sewers up to $10,000.'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-success">Evidence Citations:</p>
                      {mockEvidence.slice(0, 2).map((ev, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          <span className="truncate">{ev.source}</span>
                          <span className="text-success shrink-0">{Math.round(ev.relevance * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comparison Metrics */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5 text-primary" />
                    Side-by-Side Comparison
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

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-xl p-4"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate('/workspace')}>
                  Exit Comparison
                </Button>
                <Link to="/quality-lab">
                  <Button variant="ghost">View Quality Details</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">ACBO Mode</span>
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">Active</span>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Standard Workspace Layout
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border bg-card/50 overflow-hidden"
            >
              <div className="p-4 space-y-6 h-full overflow-y-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents ({mockDocuments.length})
                  </h3>
                  <div className="space-y-2">
                    {mockDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                      >
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.chunks} chunks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Entities */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Entities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockEntities.map((entity) => (
                      <span
                        key={entity.name}
                        className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors"
                      >
                        {entity.name} ({entity.count})
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Graph */}
                <Button variant="outline" className="w-full gap-2">
                  <Network className="h-4 w-4" />
                  View Knowledge Graph
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Query Section */}
          <div className="p-6 border-b border-border">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about your documents..."
                  className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-secondary/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" size="lg" disabled={isQuerying || !query.trim()}>
                  {isQuerying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Run Query
                </Button>
                <Button type="button" variant="outline" onClick={() => setQuery('')}>
                  Clear
                </Button>
              </div>
            </form>
          </div>

          {/* Response Section */}
          <div className="flex-1 overflow-y-auto p-6">
            {showResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Response */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      Under Policy Section 4.2, water damage coverage includes: (1) Sudden and accidental 
                      discharge from plumbing systems up to $50,000, (2) Storm-related water intrusion with 
                      $2,500 deductible. Key exclusions: gradual seepage, flood (requires separate policy), 
                      and damage from lack of maintenance. The 2024 amendment (Doc 3, pg 12) added coverage 
                      for backup of sewers up to $10,000.
                    </p>
                    
                    {/* Feedback */}
                    <div className="flex items-center gap-2 pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">Was this helpful?</span>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Provide Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Evidence */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evidence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockEvidence.map((ev, i) => (
                      <EvidenceLink key={i} evidence={ev} index={i} />
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter a query to get started</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Metrics */}
        <aside className="w-80 border-l border-border bg-card/50 p-4 overflow-y-auto hidden xl:block">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Query Metrics</h3>
          
          {showResults ? (
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <QualityGauge score={0.94} size="lg" />
              </div>
              
              <MetricCard
                title="Budget Usage"
                value="3,200 / 8,000"
                subtitle="tokens"
                variant="success"
              />
              
              <MetricCard
                title="Confidence"
                value="94%"
                subtitle="High confidence"
                variant="success"
              />
              
              <MetricCard
                title="Attempts"
                value="2"
                subtitle="Auto-corrected once"
                variant="primary"
              />
              
              <Link to="/quality-lab">
                <Button variant="outline" className="w-full mt-4">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">Metrics will appear after running a query</p>
            </div>
          )}
        </aside>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">ACBO Mode</span>
              <div className={cn(
                "h-3 w-3 rounded-full",
                acboEnabled ? "bg-success animate-pulse" : "bg-muted"
              )} />
              <span className={cn("text-sm font-medium", acboEnabled ? "text-success" : "text-muted-foreground")}>
                {acboEnabled ? 'Active' : 'Off'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleAcbo}>
              Toggle ACBO
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate('/workspace?compare=true')}
          >
            <GitCompare className="h-4 w-4" />
            Baseline Comparison
          </Button>
        </div>
      </div>
    </div>
  );
}
