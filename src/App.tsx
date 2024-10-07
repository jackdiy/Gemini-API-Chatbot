import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Moon, Sun, Settings, Paperclip, Mic, Send } from 'lucide-react';
import { Skeleton } from './components/ui/skeleton';

const ChatInterface = lazy(() => import('./components/ChatInterface'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [systemPrompt, setSystemPrompt] = useState('你是一个有用的AI助手。');
  const [input, setInput] = useState('');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="flex justify-between items-center p-4 border-b">
          <Input
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
            className="font-bold text-lg max-w-xs"
          />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto p-4">
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="输入系统提示（角色设定）..."
            className="mb-4"
          />
          
          <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
            <ChatInterface />
          </Suspense>
          
          <div className="fixed bottom-0 left-0 right-0 bg-background p-4 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow"
              />
              <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Button>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>
        
        {showSettings && (
          <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </Suspense>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;