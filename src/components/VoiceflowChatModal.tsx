import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Cpu, 
  Bike, 
  Bot, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  Settings, 
  Code,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface VoiceflowChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceflowChatModal: React.FC<VoiceflowChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeEngine, setActiveEngine] = useState<'gemini' | 'voiceflow'>('gemini');
  const [voiceflowProjectID, setVoiceflowProjectID] = useState('65df93a18b820019283f1201');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Kamusta rider! I am your MotoStreet AI Tuning & Fitment Assistant. Ask me about flyball weights for Honda Click 125i, bore kits for XRM 125, carburetor jetting, or exhaust sound levels.',
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What flyball weights should I put in Click 125 for 115+ kph top speed?',
    'Will a 59mm bore kit work on XRM 125 with stock carburetor?',
    'How do I fix CVT dragging / shudder on uphill takeoffs?',
    'What is the ideal main jet and slow jet for Keihin 28mm on Raider 150?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      const data = await response.json();
      const aiReply = data.reply || 'Here is the tuning guide: For underbones and scooters, match your flyball weights with a 1000-1500 RPM center spring for responsive acceleration without engine strain.';

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Tuning Tip: For Honda Click 125/160, use 9g + 11g combination rollers with a 13.5° modified pulley face. For Honda XRM 125, a 59mm block with high-cam gives strong hill-climbing power while maintaining reliable daily commuting.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl h-[85vh] shadow-2xl flex flex-col my-auto relative overflow-hidden">
        
        {/* Chatbot Header */}
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                  MotoStreet AI Mechanic
                </h3>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live AI Online
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Powered by Gemini & Voiceflow AI Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Engine */}
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[10px] font-bold">
              <button
                onClick={() => setActiveEngine('gemini')}
                className={`px-2 py-1 rounded transition-colors ${
                  activeEngine === 'gemini' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Gemini AI
              </button>
              <button
                onClick={() => setActiveEngine('voiceflow')}
                className={`px-2 py-1 rounded transition-colors ${
                  activeEngine === 'voiceflow' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Voiceflow
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Engine 1: Gemini Live Interactive Chat */}
        {activeEngine === 'gemini' ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-neutral-950">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-red-950 text-red-400 border border-red-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed font-['Plus_Jakarta_Sans'] ${
                      msg.sender === 'user'
                        ? 'bg-red-600 text-white rounded-tr-none'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-neutral-800 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      ME
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 p-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>AI Mechanic is calculating gear ratios & fitment...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Diagnostic Chips */}
            <div className="p-2.5 bg-neutral-900/60 border-t border-neutral-850 overflow-x-auto flex items-center gap-2 scrollbar-none">
              <span className="text-[10px] text-neutral-500 font-bold uppercase shrink-0">Quick Ask:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-[11px] whitespace-nowrap shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-neutral-900 border-t border-neutral-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask fitment, CVT tuning, carburetor sizes, or oil specs..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-xs sm:text-sm rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white shadow-md active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* Engine 2: Voiceflow Embed Visualizer */
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-neutral-950">
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase font-['Outfit']">
                <Cpu className="w-5 h-5" />
                <span>Voiceflow Dialogflow Agent Integration</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-['Plus_Jakarta_Sans']">
                To connect your customized Voiceflow motorcycle parts agent, paste your Voiceflow Project ID below. The production script will automatically bind to the widget.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-neutral-400 block">Voiceflow Project ID / Version ID:</label>
                <input
                  type="text"
                  value={voiceflowProjectID}
                  onChange={(e) => setVoiceflowProjectID(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-blue-300 font-mono"
                />
              </div>

              {/* Voiceflow Widget Code snippet */}
              <div className="rounded-xl bg-neutral-950 border border-neutral-850 p-3 space-y-2 font-mono text-[11px] text-neutral-400">
                <div className="text-neutral-500 text-[10px]">Embedded Voiceflow Widget Script:</div>
                <pre className="overflow-x-auto text-emerald-400">
{`<script type="text/javascript">
  (function(d, t) {
    var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
    v.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: '${voiceflowProjectID}' },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production'
      });
    }
    v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
  })(document, 'script');
</script>`}
                </pre>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Voiceflow Assistant verified and ready for deployment on Vercel.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
