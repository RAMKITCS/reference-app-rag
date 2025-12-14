import { motion } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStageProps {
  stages: { name: string; description: string }[];
  currentStage: number;
  className?: string;
}

export function ProcessingStage({ stages, currentStage, className }: ProcessingStageProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {stages.map((stage, index) => {
        const isCompleted = index < currentStage;
        const isCurrent = index === currentStage;
        const isPending = index > currentStage;
        
        return (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-4 rounded-lg border p-4 transition-all duration-300',
              isCompleted && 'border-success/30 bg-success/5',
              isCurrent && 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10',
              isPending && 'border-border bg-card/50 opacity-50'
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                isCompleted && 'bg-success text-success-foreground',
                isCurrent && 'bg-primary text-primary-foreground',
                isPending && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted && <Check className="h-5 w-5" />}
              {isCurrent && <Loader2 className="h-5 w-5 animate-spin" />}
              {isPending && <span className="text-sm font-medium">{index + 1}</span>}
            </div>
            
            <div className="flex-1">
              <p className={cn(
                'font-medium',
                isCompleted && 'text-success',
                isCurrent && 'text-primary',
                isPending && 'text-muted-foreground'
              )}>
                {stage.name}
              </p>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </div>
            
            {isCurrent && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
