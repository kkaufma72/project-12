import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { useMLContext } from '../../context/MLContext';
import Button from '../common/Button';
import Card from '../common/Card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatInterface: React.FC = () => {
  const { datasets } = useMLContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check environment variables on component mount
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError('Missing required environment variables. Please check your configuration.');
      return;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError('Missing required environment variables. Please check your configuration.');
      return;
    }

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // First ensure the config function is working and has the API key
      const configResponse = await fetch(`${supabaseUrl}/functions/v1/chat-config`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      if (!configResponse.ok) {
        const errorData = await configResponse.json();
        throw new Error(errorData.error || 'Failed to get chat configuration');
      }

      const config = await configResponse.json();
      
      if (!config.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (error && messages.length === 0) {
    return (
      <Card className="flex flex-col h-[600px] items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 text-center max-w-md">{error}</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm">
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your datasets..."
            className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading || !!error}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || !!error}
            icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;