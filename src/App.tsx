import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DomainSelector from "./pages/DomainSelector";
import UploadPage from "./pages/UploadPage";
import Workspace from "./pages/Workspace";
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
          <Route path="/domain-selector" element={<DomainSelector />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/workspace" element={<Workspace />} />
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
