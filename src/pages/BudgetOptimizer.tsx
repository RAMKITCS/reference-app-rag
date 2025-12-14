import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Sliders,
  Zap,
  TrendingDown,
  TrendingUp,
  ArrowLeft,
  Info,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { MetricCard } from '@/components/shared/MetricCard';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const chunkCandidates = [
  { id: 1, text: 'Water damage coverage under Section 4.2...', score: 0.94, tokens: 120, selected: true },
  { id: 2, text: 'Policy exclusions for gradual seepage...', score: 0.89, tokens: 85, selected: true },
  { id: 3, text: '2024 Amendment: Sewer backup coverage...', score: 0.85, tokens: 95, selected: true },
  { id: 4, text: 'Deductible requirements for water claims...', score: 0.78, tokens: 110, selected: true },
  { id: 5, text: 'General policy terms and conditions...', score: 0.45, tokens: 150, selected: false },
  { id: 6, text: 'Contact information and claims process...', score: 0.32, tokens: 180, selected: false },
];

export default function BudgetOptimizer() {
  const [budget, setBudget] = useState([4000]);
  const [qualityWeight, setQualityWeight] = useState([0.7]);
  const [diversityWeight, setDiversityWeight] = useState([0.3]);

  const selectedChunks = chunkCandidates.filter(c => c.selected);
  const totalTokens = selectedChunks.reduce((sum, c) => sum + c.tokens, 0);
  const avgScore = selectedChunks.reduce((sum, c) => sum + c.score, 0) / selectedChunks.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to="/workspace">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Optimizer</h1>
            <p className="text-muted-foreground">Token allocation and chunk selection optimization</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Optimization Formula */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Optimization Formula
                </CardTitle>
                <CardDescription>ACBO's mathematical approach to context selection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-xl bg-secondary/50 border border-border mb-6 font-mono text-sm overflow-x-auto">
                  <p className="text-primary mb-4">// ACBO Budget Optimization Function</p>
                  <p className="text-foreground">
                    <span className="text-success">maximize</span> Σ (quality_score[i] × w_q + diversity_score[i] × w_d)
                  </p>
                  <p className="text-foreground mt-2">
                    <span className="text-warning">subject to</span> Σ tokens[i] ≤ budget_limit
                  </p>
                  <p className="text-muted-foreground mt-4">
                    where: w_q = {qualityWeight[0].toFixed(2)}, w_d = {diversityWeight[0].toFixed(2)}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Budget slider */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Token Budget</label>
                      <span className="text-sm text-muted-foreground">{budget[0].toLocaleString()} tokens</span>
                    </div>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      min={1000}
                      max={8000}
                      step={100}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum tokens to allocate for context
                    </p>
                  </div>

                  {/* Quality weight */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Quality Weight (w_q)</label>
                      <span className="text-sm text-muted-foreground">{qualityWeight[0].toFixed(2)}</span>
                    </div>
                    <Slider
                      value={qualityWeight}
                      onValueChange={(v) => {
                        setQualityWeight(v);
                        setDiversityWeight([1 - v[0]]);
                      }}
                      min={0}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Prioritize high-relevance chunks
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <MetricCard
              title="Token Savings"
              value="62%"
              subtitle="vs. naive top-k"
              icon={TrendingDown}
              variant="success"
              trend={{ value: 15, label: 'improvement' }}
            />
            <MetricCard
              title="Quality Improvement"
              value="+48%"
              subtitle="compared to baseline"
              icon={TrendingUp}
              variant="success"
              trend={{ value: 12, label: 'vs last query' }}
            />
            <MetricCard
              title="Chunks Selected"
              value={`${selectedChunks.length}/${chunkCandidates.length}`}
              subtitle="optimal selection"
              icon={Zap}
              variant="primary"
            />
          </motion.div>
        </div>

        {/* Candidate Ranking Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                Chunk Candidate Ranking
              </CardTitle>
              <CardDescription>Ranked by combined quality and diversity scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Content Preview</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tokens</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chunkCandidates.map((chunk, index) => (
                      <motion.tr
                        key={chunk.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className={cn(
                          'border-b border-border transition-colors',
                          chunk.selected ? 'bg-success/5' : 'bg-muted/30 opacity-60'
                        )}
                      >
                        <td className="py-3 px-4">
                          <span className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                            chunk.selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          )}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm truncate max-w-md">{chunk.text}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'font-bold',
                            chunk.score >= 0.8 ? 'text-success' : chunk.score >= 0.5 ? 'text-warning' : 'text-destructive'
                          )}>
                            {Math.round(chunk.score * 100)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-muted-foreground">
                          {chunk.tokens}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            chunk.selected ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                          )}>
                            {chunk.selected ? 'Selected' : 'Excluded'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/30 flex items-center gap-4">
                <Sparkles className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-primary">Optimization Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Selected {selectedChunks.length} chunks using {totalTokens} tokens with average quality score of {Math.round(avgScore * 100)}%.
                    Saved {Math.round((1 - totalTokens / budget[0]) * 100)}% of budget while maximizing quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
