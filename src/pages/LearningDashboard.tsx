import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, TrendingUp, Zap, MessageSquare, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { MetricCard } from '@/components/shared/MetricCard';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function LearningDashboard() {
  const { accuracyHistory, insights } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <Link to="/workspace"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Dashboard</h1>
            <p className="text-muted-foreground">Continuous improvement insights and adaptation history</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <MetricCard title="Accuracy Gain" value="+46%" subtitle="vs. baseline" icon={TrendingUp} variant="success" />
          <MetricCard title="Patterns Learned" value="127" subtitle="active patterns" icon={Lightbulb} variant="primary" />
          <MetricCard title="Auto-corrections" value="342" subtitle="this month" icon={Zap} variant="success" />
          <MetricCard title="Feedback Applied" value="89" subtitle="user insights" icon={MessageSquare} variant="primary" />
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>Accuracy Improvement Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="baseline" stroke="hsl(var(--destructive))" strokeWidth={2} name="Baseline" />
                <Line type="monotone" dataKey="acbo" stroke="hsl(var(--success))" strokeWidth={3} name="ACBO" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Recent Insights</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, i) => (
              <motion.div key={insight.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={cn('p-4 rounded-lg border', insight.applied ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5')}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('px-2 py-0.5 rounded text-xs font-medium', insight.type === 'pattern' && 'bg-primary/20 text-primary', insight.type === 'optimization' && 'bg-success/20 text-success', insight.type === 'correction' && 'bg-warning/20 text-warning', insight.type === 'feedback' && 'bg-accent/20 text-accent')}>{insight.type}</span>
                  <span className="text-xs text-muted-foreground">{insight.timestamp.toLocaleDateString()}</span>
                </div>
                <p className="text-sm">{insight.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Impact: +{Math.round(insight.impact * 100)}%</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
