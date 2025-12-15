import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import QueryPage from "./pages/QueryPage";
import ComparisonPage from "./pages/ComparisonPage";
import ChatPage from "./pages/ChatPage";
import InsuranceQuotePage from "./pages/InsuranceQuotePage";
import QualityLab from "./pages/QualityLab";
import BudgetOptimizer from "./pages/BudgetOptimizer";
import LearningDashboard from "./pages/LearningDashboard";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/query" element={<QueryPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/insurance-quote" element={<InsuranceQuotePage />} />
          <Route path="/quality-lab" element={<QualityLab />} />
          <Route path="/budget-optimizer" element={<BudgetOptimizer />} />
          <Route path="/learning" element={<LearningDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
