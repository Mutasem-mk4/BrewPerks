import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Sparkles } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', parts: string}[]>([
    { role: 'model', parts: 'Hi there! I\'m Barista Bot. Ask me about our coffee partners or for a recommendation!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: userMsg }]);
    setIsTyping(true);

    try {
      // Pass only the recent history to keep context manageable
      const response = await chatWithAssistant(messages, userMsg);
      setMessages(prev => [...prev, { role: 'model', parts: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', parts: "Oops, I spilled the coffee! Please try asking again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-coffee-900 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 border border-coffee-100 dark:border-coffee-700 overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-coffee-700 to-coffee-600 dark:from-coffee-800 dark:to-coffee-700 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Barista Bot</h3>
                <p className="text-xs text-coffee-100">AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-coffee-50 dark:bg-coffee-950 space-y-3 h-80 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-coffee-600 dark:bg-coffee-700 text-white rounded-br-none' 
                      : 'bg-white dark:bg-coffee-900 text-coffee-900 dark:text-coffee-100 border border-coffee-100 dark:border-coffee-800 shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.parts}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-coffee-900 p-3 rounded-2xl rounded-bl-none border border-coffee-100 dark:border-coffee-800 shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-coffee-900 border-t border-coffee-100 dark:border-coffee-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about coffee..."
              className="flex-grow bg-coffee-50 dark:bg-coffee-800 border border-coffee-200 dark:border-coffee-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-coffee-500 text-coffee-900 dark:text-coffee-100 placeholder-coffee-400"
            />
            <button 
              type="submit" 
              className="bg-coffee-600 dark:bg-coffee-100 text-white dark:text-coffee-900 p-2 rounded-xl hover:bg-coffee-700 dark:hover:bg-coffee-200 transition-colors disabled:opacity-50"
              disabled={!input.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center w-14 h-14 rounded-full ${isOpen ? 'bg-coffee-400 text-white rotate-90' : 'bg-coffee-700 dark:bg-coffee-100 text-white dark:text-coffee-900'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};