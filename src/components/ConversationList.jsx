import { useState } from 'react';
import { Search } from 'lucide-react';

const mockConversations = [
  { id: '1', contactName: 'Ahmed Khan', contactInitial: 'A', channel: 'whatsapp', lastMessage: 'Hi, I need help with my order #4521', timestamp: '2m ago', unread: 3, status: 'open' },
  { id: '2', contactName: 'Sarah Miller', contactInitial: 'S', channel: 'facebook', lastMessage: 'Can you check the delivery status?', timestamp: '15m ago', unread: 1, status: 'open' },
  { id: '3', contactName: 'Fatima Ali', contactInitial: 'F', channel: 'instagram', lastMessage: 'Love your products! Do you ship to Dubai?', timestamp: '1h ago', unread: 0, status: 'open' },
  { id: '4', contactName: 'Omar Sheikh', contactInitial: 'O', channel: 'threads', lastMessage: 'Is the summer sale still on?', timestamp: '2h ago', unread: 0, status: 'open' },
  { id: '5', contactName: 'Zara Hussain', contactInitial: 'Z', channel: 'whatsapp', lastMessage: 'Thank you for the quick response!', timestamp: '3h ago', unread: 0, status: 'resolved' },
];

export default function ConversationList({ selectedId, onSelectConversation }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockConversations.filter(c => {
    if (filter !== 'all' && c.channel !== filter) return false;
    if (search && !c.contactName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="conversation-list-container">
      <div className="list-header">
        <h2>Inbox</h2>
        <div className="search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'whatsapp', 'facebook', 'instagram', 'threads'].map(f => (
            <button 
              key={f} 
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="list-content">
        {filtered.map(conv => (
          <div 
            key={conv.id} 
            className={`conv-item ${selectedId === conv.id ? 'active' : ''} ${conv.unread > 0 ? 'unread' : ''}`}
            onClick={() => onSelectConversation(conv)}
          >
            <div className="conv-avatar">{conv.contactInitial}</div>
            <div className="conv-info">
              <div className="conv-name-row">
                <span className="conv-name">{conv.contactName}</span>
                <span className="conv-time">{conv.timestamp}</span>
              </div>
              <div className="conv-msg-row">
                <span className="conv-msg">{conv.lastMessage}</span>
                {conv.unread > 0 && <span className="conv-unread-badge">{conv.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
