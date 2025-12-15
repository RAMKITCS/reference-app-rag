import { useState } from 'react';
import { ChevronDown, Zap, DollarSign, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Model {
  id: string;
  name: string;
  provider: 'azure' | 'openai';
  costPer1kInput: number;
  costPer1kOutput: number;
  contextWindow: number;
  recommendedFor: string;
  avgLatency: string;
}

const models: Model[] = [
  {
    id: 'azure-gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    provider: 'azure',
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
    contextWindow: 128000,
    recommendedFor: 'Fast queries, high volume',
    avgLatency: '1.2s',
  },
  {
    id: 'azure-gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'azure',
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
    contextWindow: 128000,
    recommendedFor: 'Balanced performance',
    avgLatency: '1.5s',
  },
  {
    id: 'azure-gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'azure',
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
    contextWindow: 128000,
    recommendedFor: 'Complex analysis',
    avgLatency: '2.5s',
  },
  {
    id: 'openai-gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    costPer1kInput: 0.01,
    costPer1kOutput: 0.03,
    contextWindow: 128000,
    recommendedFor: 'Fallback option',
    avgLatency: '2.8s',
  },
  {
    id: 'openai-gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    costPer1kInput: 0.0005,
    costPer1kOutput: 0.0015,
    contextWindow: 16385,
    recommendedFor: 'Budget-friendly',
    avgLatency: '0.8s',
  },
];

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const selectedModel = models.find((m) => m.id === value) || models[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>{selectedModel.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              ({selectedModel.provider})
            </span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-popover" align="start">
        <DropdownMenuLabel>Azure OpenAI</DropdownMenuLabel>
        {models
          .filter((m) => m.provider === 'azure')
          .map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onChange(model.id)}
              className={cn(
                'flex flex-col items-start gap-1 py-3 cursor-pointer',
                value === model.id && 'bg-primary/10'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  {value === model.id && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-xs text-muted-foreground">{model.avgLatency}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${model.costPer1kInput}/1K in
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {model.recommendedFor}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>OpenAI (Fallback)</DropdownMenuLabel>
        {models
          .filter((m) => m.provider === 'openai')
          .map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => onChange(model.id)}
              className={cn(
                'flex flex-col items-start gap-1 py-3 cursor-pointer',
                value === model.id && 'bg-primary/10'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                  {value === model.id && <Check className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-xs text-muted-foreground">{model.avgLatency}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${model.costPer1kInput}/1K in
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {model.recommendedFor}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
