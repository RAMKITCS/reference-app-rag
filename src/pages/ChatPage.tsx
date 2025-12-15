import { Header } from '@/components/shared/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="h-[calc(100vh-8rem)]">
          <ChatInterface documentIds={['doc-1', 'doc-2']} />
        </div>
      </main>
    </div>
  );
}
