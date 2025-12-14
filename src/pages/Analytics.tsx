import { motion } from 'framer-motion';
import { BarChart3, Users, Zap, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { MetricCard } from '@/components/shared/MetricCard';

const qualityTrend = [
  { date: 'Mon', score: 0.85 }, { date: 'Tue', score: 0.88 }, { date: 'Wed', score: 0.91 },
  { date: 'Thu', score: 0.89 }, { date: 'Fri', score: 0.94 }, { date: 'Sat', score: 0.92 }, { date: 'Sun', score: 0.95 },
];

const tokenUsage = [
  { name: 'Optimized', value: 3200, color: 'hsl(var(--success))' },
  { name: 'Saved', value: 4800, color: 'hsl(var(--muted))' },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Enterprise metrics and performance dashboard</p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <MetricCard title="Accuracy" value="94%" icon={CheckCircle2} variant="success" />
          <MetricCard title="Cost Savings" value="62%" icon={TrendingUp} variant="success" />
          <MetricCard title="Avg Speed" value="1.2s" icon={Clock} variant="primary" />
          <MetricCard title="Quality Score" value="91%" icon={Zap} variant="success" />
          <MetricCard title="Confidence" value="89%" icon={BarChart3} variant="primary" />
          <MetricCard title="Queries Today" value="1,247" icon={Users} variant="default" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Quality Score Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={qualityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0.8, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Token Usage Efficiency</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={tokenUsage} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {tokenUsage.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
