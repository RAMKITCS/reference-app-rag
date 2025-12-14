import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QualityGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function QualityGauge({ score, size = 'md', showLabel = true, label, className }: QualityGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 1);
  const percentage = Math.round(normalizedScore * 100);
  
  const getColor = (score: number) => {
    if (score >= 0.8) return { stroke: 'hsl(var(--success))', text: 'text-success' };
    if (score >= 0.6) return { stroke: 'hsl(var(--primary))', text: 'text-primary' };
    if (score >= 0.4) return { stroke: 'hsl(var(--warning))', text: 'text-warning' };
    return { stroke: 'hsl(var(--destructive))', text: 'text-destructive' };
  };
  
  const sizeConfig = {
    sm: { width: 80, strokeWidth: 6, fontSize: 'text-lg', labelSize: 'text-xs' },
    md: { width: 120, strokeWidth: 8, fontSize: 'text-2xl', labelSize: 'text-sm' },
    lg: { width: 160, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-base' },
  };
  
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore * circumference);
  const { stroke, text } = getColor(normalizedScore);
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background circle */}
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={config.strokeWidth}
            fill="none"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn('font-bold', config.fontSize, text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('text-muted-foreground', config.labelSize)}>
          {label || 'Quality Score'}
        </span>
      )}
    </div>
  );
}
