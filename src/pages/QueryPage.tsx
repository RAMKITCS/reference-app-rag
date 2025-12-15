import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { ModelSelector } from '@/components/query/ModelSelector';
import { StandardRAGPanel } from '@/components/query/StandardRAGPanel';
import { TrueContextRAGPanel } from '@/components/query/TrueContextRAGPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function QueryPage() {
  const [query, setQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('azure-gpt-4.1-mini');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('truecontext');
  const [results, setResults] = useState<{
    standard?: any;
    truecontext?: any;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResults({});

    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));

    setResults({
      standard: {
        response:
          'Water damage coverage is mentioned in section 4. Some exclusions may apply. The policy indicates coverage for certain types of water damage incidents...',
        metrics: {
          tokensInput: 4200,
          tokensOutput: 450,
          cost: 0.0028,
          time: 1.8,
          chunksRetrieved: 10,
          confidence: 0.65,
        },
        evidence: [
          {
            text: 'Section 4 discusses various types of coverage including water damage...',
            source: 'Policy_2024.pdf, Page 12',
            relevance: 0.72,
          },
          {
            text: 'Exclusions may apply to certain circumstances...',
            source: 'Policy_2024.pdf, Page 18',
            relevance: 0.68,
          },
        ],
      },
      truecontext: {
        response:
          'Under Policy Section 4.2, water damage coverage includes:\n\n1. **Sudden and accidental discharge** from plumbing systems up to $50,000\n2. **Storm-related water intrusion** with $2,500 deductible\n\n**Key Exclusions:**\n- Gradual seepage\n- Flood (requires separate policy)\n- Damage from lack of maintenance\n\nThe 2024 amendment (Doc 3, pg 12) added coverage for backup of sewers up to $10,000.',
        metrics: {
          tokensInput: 2800,
          tokensOutput: 380,
          cost: 0.0018,
          time: 2.4,
          chunksSelected: 8,
          chunksCandidates: 45,
          budgetUsed: 32000,
          budgetTotal: 100000,
        },
        quality: {
          overall: 0.94,
          attempts: 2,
          dimensions: [
            { name: 'Coverage', score: 0.95, threshold: 0.85 },
            { name: 'Coherence', score: 0.92, threshold: 0.75 },
            { name: 'Sufficiency', score: 0.88, threshold: 0.80 },
            { name: 'Distribution', score: 0.85, threshold: 0.70 },
            { name: 'Redundancy', score: 0.12, threshold: 0.15 },
            { name: 'Temporal', score: 0.91, threshold: 0.85 },
          ],
        },
        evidence: [
          {
            text: 'Water damage coverage includes sudden and accidental discharge from plumbing systems...',
            source: 'Policy_2024.pdf, Page 12',
            relevance: 0.94,
          },
          {
            text: 'Exclusions: gradual seepage, flood conditions, maintenance-related damage...',
            source: 'Coverage_Terms.docx, Section 4.2',
            relevance: 0.89,
          },
          {
            text: '2024 Amendment: Sewer backup coverage increased to $10,000...',
            source: 'Amendment_2024.pdf, Page 3',
            relevance: 0.85,
          },
        ],
      },
    });

    setIsLoading(false);
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Query Documents</h1>
          <p className="text-muted-foreground">
            Ask questions about your uploaded documents using Standard RAG or TrueContext AI
          </p>
        </motion.div>

        {/* Query Input */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query about the documents..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="flex flex-col gap-2 w-64">
                  <ModelSelector value={selectedModel} onChange={setSelectedModel} />
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!query.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Run Query
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="truecontext">TrueContext AI</TabsTrigger>
            <TabsTrigger value="standard">Standard RAG</TabsTrigger>
          </TabsList>

          <TabsContent value="truecontext">
            <TrueContextRAGPanel
              isLoading={isLoading && activeTab === 'truecontext'}
              response={results.truecontext?.response}
              metrics={results.truecontext?.metrics}
              quality={results.truecontext?.quality}
              evidence={results.truecontext?.evidence}
            />
          </TabsContent>

          <TabsContent value="standard">
            <StandardRAGPanel
              isLoading={isLoading && activeTab === 'standard'}
              response={results.standard?.response}
              metrics={results.standard?.metrics}
              evidence={results.standard?.evidence}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
