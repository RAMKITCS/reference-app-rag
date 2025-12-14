import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonMetricProps {
  label: string;
  baselineValue: number | string;
  acboValue: number | string;
  format?: 'percent' | 'number' | 'tokens';
  higherIsBetter?: boolean;
  className?: string;
}

export function ComparisonMetric({
  label,
  baselineValue,
  acboValue,
  format = 'number',
  higherIsBetter = true,
  className,
}: ComparisonMetricProps) {
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'percent':
        return `${Math.round(value * 100)}%`;
      case 'tokens':
        return value.toLocaleString();
      default:
        return value.toLocaleString();
    }
  };

  const numBaseline = typeof baselineValue === 'number' ? baselineValue : parseFloat(baselineValue);
  const numAcbo = typeof acboValue === 'number' ? acboValue : parseFloat(acboValue);
  
  const baselineWins = higherIsBetter ? numBaseline > numAcbo : numBaseline < numAcbo;
  const acboWins = higherIsBetter ? numAcbo > numBaseline : numAcbo < numBaseline;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex items-center gap-4 rounded-lg border border-border bg-card p-4',
        className
      )}
    >
      <div className="flex-1 text-center">
        <p className="text-xs text-muted-foreground mb-1">Baseline</p>
        <p className={cn(
          'text-xl font-bold',
          baselineWins ? 'text-success' : 'text-destructive'
        )}>
          {formatValue(baselineValue)}
        </p>
        {baselineWins && (
          <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
            <Check className="h-3 w-3" /> Better
          </span>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground mb-2">{label}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex-1 text-center">
        <p className="text-xs text-muted-foreground mb-1">ACBO</p>
        <p className={cn(
          'text-xl font-bold',
          acboWins ? 'text-success' : 'text-destructive'
        )}>
          {formatValue(acboValue)}
        </p>
        {acboWins && (
          <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
            <Check className="h-3 w-3" /> Better
          </span>
        )}
      </div>
    </motion.div>
  );
}
