import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  ArrowRight,
  Sparkles,
  Check,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { ProcessingStage } from '@/components/shared/ProcessingStage';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const processingStages = [
  { name: 'OCR & Text Extraction', description: 'Extracting text from documents with high accuracy' },
  { name: 'Entity Extraction', description: 'Identifying named entities, dates, and key terms' },
  { name: 'Embedding Generation', description: 'Creating vector embeddings with Azure OpenAI' },
  { name: 'Vector Indexing', description: 'Building FAISS index for fast retrieval' },
  { name: 'Graph Construction', description: 'Creating Neo4j knowledge graph relationships' },
  { name: 'Quality Analysis', description: 'Calculating chunk quality scores' },
];

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return FileText;
  if (type.includes('csv') || type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
  return File;
};

export default function UploadPage() {
  const navigate = useNavigate();
  const { documents, addDocuments, processingStage, setProcessingStage, isProcessing, setIsProcessing } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setProcessingStage(0);
    
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      setProcessingStage(stage);
      if (stage >= processingStages.length) {
        clearInterval(interval);
        const newDocs = uploadedFiles.map((file, i) => ({
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          status: 'completed' as const,
          chunks: Math.floor(Math.random() * 50) + 20,
          entities: ['Policy Holder', 'Coverage Amount', 'Effective Date', 'Exclusions'],
        }));
        addDocuments(newDocs);
      }
    }, 1500);
  };

  const isComplete = processingStage >= processingStages.length;

  return (
    <div className="min-h-screen bg-background">
      <Header showNav={false} />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Upload Documents</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your documents for processing. TrueContext AI will analyze, chunk, and index them for quality-first retrieval.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Zone */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    'relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
                    isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                    isProcessing && 'opacity-50 pointer-events-none'
                  )}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                    accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Drop files here or click to upload</p>
                      <p className="text-sm text-muted-foreground">PDF, DOCX, CSV, TXT supported</p>
                    </div>
                  </div>
                </div>

                {/* File list */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {uploadedFiles.length} file(s) ready
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {uploadedFiles.map((file, index) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
                          >
                            <FileIcon className="h-5 w-5 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            {!isProcessing && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    disabled={uploadedFiles.length === 0 || isProcessing}
                    onClick={startProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Process Documents'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Processing Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Processing Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessingStage 
                  stages={processingStages} 
                  currentStage={processingStage} 
                />

                {/* Innovation callout */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-primary">TrueContext Innovation</p>
                      <p className="text-sm text-muted-foreground">
                        TrueContext enriches each chunk with contextual metadata: document type, section,
                        key entities, and quality scores for quality-first retrieval.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Continue button */}
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => navigate('/query')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Continue to Query
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
