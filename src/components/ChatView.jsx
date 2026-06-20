import { useState } from 'react';
import { Paperclip, Smile, SendHorizontal, ArrowLeft, Info } from 'lucide-react';

const mockMessages = {
  '1': [
    { id: 'm1', sender: 'customer', content: 'Hi, I need help with my order #4521', time: '10:30 AM' },
    { id: 'm2', sender: 'agent', content: "Hello Ahmed! I'd be happy to help. Let me look up your order right away.", time: '10:31 AM' },
    { id: 'm3', sender: 'customer', content: "Thank you. I ordered 3 days ago but haven't received any tracking info yet.", time: '10:32 AM' },
    { id: 'm4', sender: 'agent', content: "I can see your order was shipped yesterday. Here's your tracking number: PKG-2026-4521-TR. You should receive it within 2-3 business days.", time: '10:33 AM' },
    { id: 'm5', sender: 'customer', content: "That's great! Can I also change the delivery address?", time: '10:35 AM' },
  ],
  '2': [
    { id: 'm1', sender: 'customer', content: 'Can you check the delivery status?', time: '9:45 AM' },
    { id: 'm2', sender: 'agent', content: 'Of course! Could you please share your order number?', time: '9:46 AM' },
    { id: 'm3', sender: 'customer', content: "It's ORD-7823", time: '9:47 AM' },
  ]
};

export default function ChatView({ conversation, onToggleContact, onBack }) {
  const [input, setInput] = useState('');

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

  const messages = mockMessages[conversation.id] || [];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="chat-back-btn hide-desktop" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="chat-header-info">
          <div className="chat-header-avatar">{conversation.contactInitial}</div>
          <div>
            <h3>{conversation.contactName}</h3>
            <span className={`badge badge-${conversation.channel}`}>{conversation.channel}</span>
          </div>
        </div>
        <button className="chat-info-btn" onClick={onToggleContact}>
          <Info size={20} />
        </button>
      </div>

      <div className="chat-messages">
        <div className="chat-date-separator"><span>Today</span></div>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.sender === 'customer' ? 'msg-customer' : 'msg-agent'}`}>
            <div className="msg-bubble">
              {msg.content}
            </div>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <button className="chat-input-btn"><Paperclip size={20} /></button>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input-field"
        />
        <button className="chat-input-btn"><Smile size={20} /></button>
        <button className="chat-send-btn" disabled={!input.trim()}>
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

// Ensure MessageCircle is imported for the empty state
import { MessageCircle } from 'lucide-react';
