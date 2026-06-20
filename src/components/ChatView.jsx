import { useState, useEffect, useRef } from 'react';
import { Paperclip, Smile, SendHorizontal, ArrowLeft, Info, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ChatView({ conversation, onToggleContact, onBack }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();

      const subscription = supabase
        .channel(`public:messages:conversation_id=eq.${conversation.id}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    // Optimistic UI update
    const tempMsg = {
      id: 'temp-' + Date.now(),
      sender_type: 'agent',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    // Send via Edge Function
    const { error } = await supabase.functions.invoke('send-message', {
      body: { 
        contactId: conversation.contact_id, 
        channel: conversation.channel, 
        messageText: text 
      }
    });

    if (error) {
      console.error("Error sending message:", error);
      // Revert optimistic update on error
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      alert("Failed to send message. Please check console.");
    } else {
      // Save to database
      await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_type: 'agent',
        content: text
      });
    }

    setSending(false);
  };

  if (!conversation) {
    return (
      <div className="chat-empty">
        <div className="chat-empty-content">
          <MessageCircle size={64} className="text-muted mb-4" />
          <h3>Select a conversation</h3>
          <p className="text-muted">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="chat-back-btn hide-desktop" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="chat-header-info">
          <div className="chat-header-avatar">{conversation.contact_name?.charAt(0).toUpperCase()}</div>
          <div>
            <h3>{conversation.contact_name}</h3>
            <span className={`badge badge-${conversation.channel}`}>{conversation.channel}</span>
          </div>
        </div>
        <button className="chat-info-btn" onClick={onToggleContact}>
          <Info size={20} />
        </button>
      </div>

      <div className="chat-messages">
        <div className="chat-date-separator"><span>Conversation History</span></div>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender_type === 'customer' ? 'msg-customer' : 'msg-agent'}`}>
            <div className="msg-bubble">
              {msg.content}
            </div>
            <span className="msg-time">
              {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <button className="chat-input-btn"><Paperclip size={20} /></button>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="chat-input-field"
        />
        <button className="chat-input-btn"><Smile size={20} /></button>
        <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim() || sending}>
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

// Ensure MessageCircle is imported for the empty state
import { MessageCircle } from 'lucide-react';
