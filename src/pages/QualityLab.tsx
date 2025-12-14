import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Gauge,
  Target,
  Layers,
  CheckCircle2,
  BarChart3,
  Clock,
  Repeat,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { QualityGauge } from '@/components/shared/QualityGauge';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const qualityDimensions = [
  { 
    name: 'Coverage', 
    score: 0.95, 
    threshold: 0.8, 
    description: 'How well retrieved chunks cover the query scope',
    icon: Target,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Coherence', 
    score: 0.92, 
    threshold: 0.75, 
    description: 'Logical flow and context consistency across chunks',
    icon: Layers,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Sufficiency', 
    score: 0.88, 
    threshold: 0.7, 
    description: 'Completeness of information for answering',
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-500'
  },
  { 
    name: 'Distribution', 
    score: 0.91, 
    threshold: 0.6, 
    description: 'Balance of sources and document coverage',
    icon: BarChart3,
    color: 'from-orange-500 to-amber-500'
  },
  { 
    name: 'Redundancy', 
    score: 0.85, 
    threshold: 0.5, 
    description: 'Low overlap and repetition between chunks',
    icon: Repeat,
    color: 'from-red-500 to-rose-500'
  },
  { 
    name: 'Temporal', 
    score: 0.94, 
    threshold: 0.7, 
    description: 'Relevance and recency of information',
    icon: Clock,
    color: 'from-teal-500 to-cyan-500'
  },
];

const attemptTimeline = [
  {
    attempt: 1,
    timestamp: '0.0s',
    dimensions: {
      Coverage: 0.68,
      Coherence: 0.72,
      Sufficiency: 0.65,
      Distribution: 0.78,
      Redundancy: 0.82,
      Temporal: 0.90,
    },
    passed: false,
    action: 'Auto-correction triggered: Adding context chunks',
  },
  {
    attempt: 2,
    timestamp: '0.8s',
    dimensions: {
      Coverage: 0.95,
      Coherence: 0.92,
      Sufficiency: 0.88,
      Distribution: 0.91,
      Redundancy: 0.85,
      Temporal: 0.94,
    },
    passed: true,
    action: 'All quality gates passed',
  },
];

export default function QualityLab() {
  const overallScore = qualityDimensions.reduce((sum, d) => sum + d.score, 0) / qualityDimensions.length;

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
            <h1 className="text-3xl font-bold tracking-tight">Quality Lab</h1>
            <p className="text-muted-foreground">Six-dimension quality analysis and validation</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  Overall Quality
                </CardTitle>
                <CardDescription>Aggregate score across all dimensions</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <QualityGauge score={overallScore} size="lg" label="Overall Score" />
                
                <div className="mt-8 w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attempts</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Auto-corrections</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Chunks evaluated</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dimensions Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Quality Dimensions</CardTitle>
                <CardDescription>Individual dimension scores and thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qualityDimensions.map((dimension, index) => {
                    const passed = dimension.score >= dimension.threshold;
                    return (
                      <motion.div
                        key={dimension.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={cn(
                          'rounded-xl border p-4 transition-all hover:shadow-lg',
                          passed ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', dimension.color)}>
                            <dimension.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">{dimension.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Threshold: {Math.round(dimension.threshold * 100)}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dimension.score * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={cn(
                              'absolute inset-y-0 left-0 rounded-full',
                              passed ? 'bg-success' : 'bg-warning'
                            )}
                          />
                          {/* Threshold marker */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-foreground/50"
                            style={{ left: `${dimension.threshold * 100}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            'text-2xl font-bold',
                            passed ? 'text-success' : 'text-warning'
                          )}>
                            {Math.round(dimension.score * 100)}%
                          </span>
                          {passed && <CheckCircle2 className="h-5 w-5 text-success" />}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          {dimension.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Attempt Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Quality Attempt Timeline
              </CardTitle>
              <CardDescription>Step-by-step validation with auto-correction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attemptTimeline.map((attempt, index) => (
                  <motion.div
                    key={attempt.attempt}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={cn(
                      'relative pl-8 pb-6',
                      index < attemptTimeline.length - 1 && 'border-l-2 border-border ml-4'
                    )}
                  >
                    {/* Timeline dot */}
                    <div className={cn(
                      'absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center',
                      attempt.passed ? 'bg-success' : 'bg-warning'
                    )}>
                      <span className="text-xs font-bold text-white">{attempt.attempt}</span>
                    </div>
                    
                    <div className={cn(
                      'rounded-xl border p-4',
                      attempt.passed ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold">Attempt {attempt.attempt}</p>
                          <p className="text-sm text-muted-foreground">{attempt.timestamp}</p>
                        </div>
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          attempt.passed ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        )}>
                          {attempt.passed ? 'PASSED' : 'RETRY'}
                        </span>
                      </div>
                      
                      {/* Dimension scores for this attempt */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        {Object.entries(attempt.dimensions).map(([name, score]) => {
                          const dim = qualityDimensions.find(d => d.name === name);
                          const passed = score >= (dim?.threshold || 0);
                          return (
                            <div key={name} className="text-center">
                              <p className="text-xs text-muted-foreground mb-1">{name}</p>
                              <p className={cn(
                                'text-lg font-bold',
                                passed ? 'text-success' : 'text-warning'
                              )}>
                                {Math.round(score * 100)}%
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{attempt.action}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
