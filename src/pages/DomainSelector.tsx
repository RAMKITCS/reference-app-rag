import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Scale, 
  TrendingUp, 
  Heart, 
  FileText, 
  Settings,
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { useAppStore } from '@/store/useAppStore';

const domains = [
  { id: 'Insurance', icon: Shield, color: 'from-blue-500 to-cyan-500', description: 'Policy analysis, claims processing, coverage verification' },
  { id: 'Legal', icon: Scale, color: 'from-purple-500 to-pink-500', description: 'Contract review, compliance, regulatory analysis' },
  { id: 'Financial', icon: TrendingUp, color: 'from-green-500 to-emerald-500', description: 'Risk assessment, financial statements, auditing' },
  { id: 'Medical', icon: Heart, color: 'from-red-500 to-orange-500', description: 'Clinical documentation, research papers, patient records' },
  { id: 'Generic', icon: FileText, color: 'from-gray-500 to-slate-500', description: 'General-purpose document analysis' },
  { id: 'Custom', icon: Settings, color: 'from-amber-500 to-yellow-500', description: 'Configure your own domain settings', disabled: true },
];

export default function DomainSelector() {
  const navigate = useNavigate();
  const { setDomain, demoScenarios, setActiveScenario, setIsProcessing } = useAppStore();

  const handleDomainSelect = (domain: string) => {
    setDomain(domain);
    navigate('/upload');
  };

  const handleDemoScenario = (scenarioId: string) => {
    const scenario = demoScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setDomain(scenario.domain);
      setActiveScenario(scenario);
      navigate('/workspace?compare=true');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showNav={false} />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Select Your Domain</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a specialized domain for optimized document understanding, entity extraction, and quality validation.
          </p>
        </motion.div>

        {/* Domain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-primary/50 ${domain.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !domain.disabled && handleDomainSelect(domain.id)}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <domain.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {domain.id}
                    {domain.disabled && (
                      <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{domain.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary/10 group-hover:text-primary"
                    disabled={domain.disabled}
                  >
                    Select Domain
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Demo Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Quick Start</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Try Demo Scenarios</h2>
            <p className="text-muted-foreground">
              Jump straight into pre-configured demos to see ACBO in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card 
                  glass 
                  className="cursor-pointer group hover:border-primary/50"
                  onClick={() => handleDemoScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{scenario.name}</p>
                        <p className="text-xs text-muted-foreground">{scenario.domain}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {scenario.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
