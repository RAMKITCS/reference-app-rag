import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { source: string; relevance: number }[];
}

interface ChatInterfaceProps {
  documentIds?: string[];
}

export function ChatInterface({ documentIds = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1500));

    const aiMessage: Message = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content: `Based on the uploaded documents, I found relevant information about "${content.slice(0, 50)}...":\n\nThe policy document (Section 4.2) indicates specific coverage provisions that apply to your query. Key points include:\n\n1. Coverage limits are defined in the base policy\n2. Specific exclusions apply as outlined in Amendment A\n3. Claims procedures are detailed in the supplementary materials\n\nWould you like me to provide more specific details about any of these points?`,
      timestamp: new Date(),
      sources: [
        { source: 'Policy_2024.pdf, Page 12', relevance: 0.94 },
        { source: 'Amendment_A.docx, Section 3', relevance: 0.87 },
      ],
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-border py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            TrueContext Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            {documentIds.length > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {documentIds.length} document(s) loaded
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              disabled={messages.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Start a Conversation</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Ask questions about your uploaded documents. TrueContext AI uses
                quality-first retrieval with memory across your conversation.
              </p>
            </motion.div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                sources={message.sources}
              />
            ))
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">TrueContext is thinking...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <ChatInput
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="Ask about your documents..."
          />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Conversation turn: {messages.filter((m) => m.role === 'user').length} | Memory active
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
