import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Building2,
  User,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/shared/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  type: 'policy' | 'claims';
  status: 'uploaded' | 'processing' | 'ready';
}

export default function InsuranceQuotePage() {
  const [policyFile, setPolicyFile] = useState<UploadedFile | null>(null);
  const [claimsFile, setClaimsFile] = useState<UploadedFile | null>(null);
  const [applicantInfo, setApplicantInfo] = useState({
    name: '',
    company: '',
    effectiveDate: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(-1);
  const [quoteGenerated, setQuoteGenerated] = useState(false);

  const generationSteps = [
    'Extracting policy information...',
    'Analyzing loss history...',
    'Calculating risk assessment...',
    'Generating quote document...',
    'Running comparison analysis...',
  ];

  const handleFileUpload = (type: 'policy' | 'claims') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        type,
        status: 'processing',
      };
      
      if (type === 'policy') setPolicyFile(uploadedFile);
      else setClaimsFile(uploadedFile);

      // Simulate processing
      setTimeout(() => {
        if (type === 'policy') setPolicyFile({ ...uploadedFile, status: 'ready' });
        else setClaimsFile({ ...uploadedFile, status: 'ready' });
      }, 1500);
    }
  };

  const generateQuote = async () => {
    if (!policyFile || !claimsFile) return;

    setIsGenerating(true);
    setQuoteGenerated(false);
    setGenerationStep(-1);

    for (let i = 0; i < generationSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      setGenerationStep(i);
    }

    await new Promise((r) => setTimeout(r, 500));
    setIsGenerating(false);
    setQuoteGenerated(true);
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
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Insurance Quote Generator
          </h1>
          <p className="text-muted-foreground">
            Upload policy documents and loss runs to generate comprehensive insurance quotes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Upload */}
          <div className="lg:col-span-1 space-y-4">
            {/* Policy Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Policy Document
                </CardTitle>
                <CardDescription>Upload the existing insurance policy (PDF)</CardDescription>
              </CardHeader>
              <CardContent>
                {policyFile ? (
                  <div className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    policyFile.status === 'ready' ? 'border-success/30 bg-success/5' : 'border-border'
                  )}>
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{policyFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {policyFile.status === 'processing' ? 'Processing...' : 'Ready'}
                      </p>
                    </div>
                    {policyFile.status === 'ready' ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload PDF</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload('policy')}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Claims Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Loss Runs
                </CardTitle>
                <CardDescription>Upload claim history (CSV or Excel)</CardDescription>
              </CardHeader>
              <CardContent>
                {claimsFile ? (
                  <div className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    claimsFile.status === 'ready' ? 'border-success/30 bg-success/5' : 'border-border'
                  )}>
                    <FileSpreadsheet className="h-8 w-8 text-accent" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{claimsFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {claimsFile.status === 'processing' ? 'Processing...' : 'Ready'}
                      </p>
                    </div>
                    {claimsFile.status === 'ready' ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload CSV</span>
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      onChange={handleFileUpload('claims')}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Applicant Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Applicant Name</label>
                  <Input
                    value={applicantInfo.name}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Company</label>
                  <Input
                    value={applicantInfo.company}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, company: e.target.value })}
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Effective Date</label>
                  <Input
                    type="date"
                    value={applicantInfo.effectiveDate}
                    onChange={(e) => setApplicantInfo({ ...applicantInfo, effectiveDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              disabled={!policyFile || !claimsFile || policyFile.status !== 'ready' || claimsFile.status !== 'ready' || isGenerating}
              onClick={generateQuote}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate Insurance Quote
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quote Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4 py-8">
                    {generationSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: generationStep >= i ? 1 : 0.3, x: 0 }}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-3',
                          generationStep === i && 'border-primary/50 bg-primary/5',
                          generationStep > i && 'border-success/30 bg-success/5'
                        )}
                      >
                        {generationStep > i ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : generationStep === i ? (
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : (
                          <div className="h-5 w-5" />
                        )}
                        <span className="text-sm">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : quoteGenerated ? (
                  <Tabs defaultValue="summary" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="summary">Executive Summary</TabsTrigger>
                      <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
                      <TabsTrigger value="premium">Premium</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border border-border bg-card p-4 text-center">
                          <DollarSign className="h-6 w-6 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">$24,500</p>
                          <p className="text-xs text-muted-foreground">Annual Premium</p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4 text-center">
                          <Building2 className="h-6 w-6 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">$2M</p>
                          <p className="text-xs text-muted-foreground">Total Coverage</p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4 text-center">
                          <Calendar className="h-6 w-6 mx-auto text-primary mb-2" />
                          <p className="text-2xl font-bold">12 mo</p>
                          <p className="text-xs text-muted-foreground">Policy Term</p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          Recommendation: Accept
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Based on the loss history analysis, this applicant presents a favorable risk
                          profile. The 5-year loss ratio of 42% is below the industry average of 55%.
                          No major claims in the past 3 years.
                        </p>
                      </div>

                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Quote PDF
                      </Button>
                    </TabsContent>

                    <TabsContent value="coverage" className="space-y-3">
                      {[
                        { name: 'General Liability', limit: '$1,000,000', deductible: '$2,500' },
                        { name: 'Property Coverage', limit: '$500,000', deductible: '$5,000' },
                        { name: 'Business Interruption', limit: '$250,000', deductible: '$1,000' },
                        { name: 'Professional Liability', limit: '$500,000', deductible: '$2,500' },
                      ].map((coverage) => (
                        <div key={coverage.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <span className="font-medium">{coverage.name}</span>
                          <div className="text-right">
                            <p className="text-sm">{coverage.limit}</p>
                            <p className="text-xs text-muted-foreground">Deductible: {coverage.deductible}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="premium" className="space-y-3">
                      <div className="space-y-2">
                        {[
                          { item: 'Base Premium', amount: '$18,000' },
                          { item: 'Experience Modification', amount: '+$2,500' },
                          { item: 'Territory Factor', amount: '+$1,500' },
                          { item: 'Multi-Policy Discount', amount: '-$2,500' },
                          { item: 'Claims-Free Discount', amount: '-$1,000' },
                        ].map((line) => (
                          <div key={line.item} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{line.item}</span>
                            <span>{line.amount}</span>
                          </div>
                        ))}
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Annual Premium</span>
                            <span className="text-primary">$24,500</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="comparison" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <span className="font-semibold">Standard RAG</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Completeness: 72%</p>
                          <ul className="text-xs space-y-1 text-muted-foreground">
                            <li>• Missing 3 exclusion clauses</li>
                            <li>• Incomplete loss analysis</li>
                            <li>• Wrong territory factor</li>
                          </ul>
                        </div>
                        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-5 w-5 text-success" />
                            <span className="font-semibold">TrueContext AI</span>
                          </div>
                          <p className="text-xs text-success mb-2">Completeness: 98%</p>
                          <ul className="text-xs space-y-1 text-muted-foreground">
                            <li>• All exclusions identified</li>
                            <li>• 5-year loss trend analyzed</li>
                            <li>• Accurate calculations</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No Quote Generated Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Upload your policy document and loss runs, then click "Generate Insurance Quote"
                      to create a comprehensive quote using TrueContext AI.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
