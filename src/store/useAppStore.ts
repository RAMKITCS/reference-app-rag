import { create } from 'zustand';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  chunks?: number;
  entities?: string[];
}

export interface Entity {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'date' | 'location' | 'policy' | 'clause';
  count: number;
  documentIds: string[];
}

export interface QualityDimension {
  name: string;
  score: number;
  threshold: number;
  passed: boolean;
  description: string;
}

export interface QueryResult {
  id: string;
  query: string;
  response: string;
  evidence: { text: string; source: string; relevance: number }[];
  qualityScore: number;
  dimensions: QualityDimension[];
  tokensUsed: number;
  budgetLimit: number;
  attempts: number;
  timestamp: Date;
  mode: 'baseline' | 'acbo';
  feedback?: 'positive' | 'negative';
}

export interface LearningInsight {
  id: string;
  type: 'pattern' | 'optimization' | 'correction' | 'feedback';
  description: string;
  impact: number;
  timestamp: Date;
  applied: boolean;
}

export interface DemoScenario {
  id: string;
  name: string;
  domain: string;
  query: string;
  description: string;
  baselineResult: Partial<QueryResult>;
  acboResult: Partial<QueryResult>;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  
  // Domain
  selectedDomain: string | null;
  
  // Documents
  documents: Document[];
  entities: Entity[];
  processingStage: number;
  isProcessing: boolean;
  
  // Query
  currentQuery: string;
  queryHistory: QueryResult[];
  activeResult: QueryResult | null;
  isQuerying: boolean;
  
  // Mode
  isCompareMode: boolean;
  acboEnabled: boolean;
  
  // Learning
  insights: LearningInsight[];
  accuracyHistory: { date: string; baseline: number; acbo: number }[];
  
  // Demo
  demoScenarios: DemoScenario[];
  activeScenario: DemoScenario | null;
  
  // Actions
  login: (email: string, password: string) => void;
  logout: () => void;
  setDomain: (domain: string) => void;
  addDocuments: (docs: Document[]) => void;
  setProcessingStage: (stage: number) => void;
  setIsProcessing: (processing: boolean) => void;
  setCurrentQuery: (query: string) => void;
  addQueryResult: (result: QueryResult) => void;
  setActiveResult: (result: QueryResult | null) => void;
  setIsQuerying: (querying: boolean) => void;
  toggleCompareMode: () => void;
  toggleAcbo: () => void;
  setActiveScenario: (scenario: DemoScenario | null) => void;
  submitFeedback: (resultId: string, feedback: 'positive' | 'negative') => void;
}

// Mock demo scenarios
const mockScenarios: DemoScenario[] = [
  {
    id: 'insurance-claim',
    name: 'Insurance Claim Analysis',
    domain: 'Insurance',
    query: 'What are the coverage limits and exclusions for water damage claims under policy section 4.2?',
    description: 'Complex multi-document query requiring cross-referencing of policy sections',
    baselineResult: {
      response: 'Water damage coverage is mentioned in section 4. Some exclusions may apply...',
      qualityScore: 0.42,
      tokensUsed: 8500,
      attempts: 1,
    },
    acboResult: {
      response: 'Under Policy Section 4.2, water damage coverage includes: (1) Sudden and accidental discharge from plumbing systems up to $50,000, (2) Storm-related water intrusion with $2,500 deductible. Key exclusions: gradual seepage, flood (requires separate policy), and damage from lack of maintenance. The 2024 amendment (Doc 3, pg 12) added coverage for backup of sewers up to $10,000.',
      qualityScore: 0.94,
      tokensUsed: 3200,
      attempts: 2,
    },
  },
  {
    id: 'legal-contract',
    name: 'Legal Contract Review',
    domain: 'Legal',
    query: 'Identify all termination clauses and their triggering conditions across the merger agreement.',
    description: 'Multi-party contract analysis with complex cross-references',
    baselineResult: {
      response: 'The agreement contains termination provisions. Section 8 discusses some conditions...',
      qualityScore: 0.38,
      tokensUsed: 9200,
      attempts: 1,
    },
    acboResult: {
      response: 'Termination clauses identified across 4 documents:\n\n1. **Material Adverse Effect (Section 8.1)**: Either party may terminate if MAC occurs, defined as >15% revenue decline or regulatory action.\n\n2. **Regulatory Failure (Section 8.2)**: Automatic termination if antitrust approval not received within 180 days. Break fee: $45M.\n\n3. **Mutual Consent (Section 8.3)**: Board approval required from both parties.\n\n4. **Fiduciary Out (Section 8.4)**: Target may terminate for superior proposal, subject to 5-day matching right and $30M termination fee.',
      qualityScore: 0.96,
      tokensUsed: 2800,
      attempts: 2,
    },
  },
  {
    id: 'financial-analysis',
    name: 'Financial Risk Assessment',
    domain: 'Financial',
    query: 'What is the overall risk exposure from derivative instruments and how has it changed year-over-year?',
    description: 'Quantitative analysis requiring temporal comparison',
    baselineResult: {
      response: 'Derivative positions are disclosed in the financial statements. Risk metrics vary...',
      qualityScore: 0.35,
      tokensUsed: 7800,
      attempts: 1,
    },
    acboResult: {
      response: 'Derivative Risk Analysis (FY2023 vs FY2024):\n\n**Total Notional Value**: $2.4B → $2.1B (-12.5%)\n**VaR (99%, 1-day)**: $18.2M → $15.7M (-13.7%)\n\nBreakdown:\n- Interest Rate Swaps: $1.2B (hedging floating debt)\n- FX Forwards: $650M (EUR/USD exposure)\n- Commodity Futures: $250M (fuel hedging)\n\n**Key Changes**: Reduced FX exposure due to European divestiture. New SOFR transition completed. Credit risk from counterparties rated A- or higher.',
      qualityScore: 0.92,
      tokensUsed: 3400,
      attempts: 3,
    },
  },
];

const mockInsights: LearningInsight[] = [
  {
    id: '1',
    type: 'pattern',
    description: 'Queries about coverage limits benefit from including policy amendment dates',
    impact: 0.15,
    timestamp: new Date(Date.now() - 86400000 * 2),
    applied: true,
  },
  {
    id: '2',
    type: 'optimization',
    description: 'Reducing chunk overlap from 20% to 10% improved retrieval precision by 8%',
    impact: 0.08,
    timestamp: new Date(Date.now() - 86400000),
    applied: true,
  },
  {
    id: '3',
    type: 'correction',
    description: 'Auto-correction detected missing temporal context in financial queries',
    impact: 0.12,
    timestamp: new Date(Date.now() - 3600000 * 5),
    applied: true,
  },
  {
    id: '4',
    type: 'feedback',
    description: 'User feedback indicates preference for structured output in legal queries',
    impact: 0.18,
    timestamp: new Date(Date.now() - 3600000 * 2),
    applied: false,
  },
];

const mockAccuracyHistory = [
  { date: 'Week 1', baseline: 0.45, acbo: 0.72 },
  { date: 'Week 2', baseline: 0.43, acbo: 0.78 },
  { date: 'Week 3', baseline: 0.44, acbo: 0.82 },
  { date: 'Week 4', baseline: 0.46, acbo: 0.85 },
  { date: 'Week 5', baseline: 0.45, acbo: 0.89 },
  { date: 'Week 6', baseline: 0.44, acbo: 0.91 },
];

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  selectedDomain: null,
  documents: [],
  entities: [],
  processingStage: 0,
  isProcessing: false,
  currentQuery: '',
  queryHistory: [],
  activeResult: null,
  isQuerying: false,
  isCompareMode: false,
  acboEnabled: true,
  insights: mockInsights,
  accuracyHistory: mockAccuracyHistory,
  demoScenarios: mockScenarios,
  activeScenario: null,

  // Actions
  login: (email, password) => set({
    isAuthenticated: true,
    user: { email, name: email.split('@')[0] },
  }),
  
  logout: () => set({
    isAuthenticated: false,
    user: null,
    selectedDomain: null,
    documents: [],
    entities: [],
  }),
  
  setDomain: (domain) => set({ selectedDomain: domain }),
  
  addDocuments: (docs) => set((state) => ({
    documents: [...state.documents, ...docs],
  })),
  
  setProcessingStage: (stage) => set({ processingStage: stage }),
  
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  
  setCurrentQuery: (query) => set({ currentQuery: query }),
  
  addQueryResult: (result) => set((state) => ({
    queryHistory: [result, ...state.queryHistory],
    activeResult: result,
  })),
  
  setActiveResult: (result) => set({ activeResult: result }),
  
  setIsQuerying: (querying) => set({ isQuerying: querying }),
  
  toggleCompareMode: () => set((state) => ({ isCompareMode: !state.isCompareMode })),
  
  toggleAcbo: () => set((state) => ({ acboEnabled: !state.acboEnabled })),
  
  setActiveScenario: (scenario) => set({ activeScenario: scenario }),
  
  submitFeedback: (resultId, feedback) => set((state) => ({
    queryHistory: state.queryHistory.map((r) =>
      r.id === resultId ? { ...r, feedback } : r
    ),
    activeResult: state.activeResult?.id === resultId
      ? { ...state.activeResult, feedback }
      : state.activeResult,
  })),
}));
