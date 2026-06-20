import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ConversationList({ selectedId, onSelectConversation }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('public:conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        fetchConversations(); // Refresh list on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });
      
    if (!error && data) {
      setConversations(data);
    }
  };

  const filtered = conversations.filter(c => {
    if (filter !== 'all' && c.channel !== filter) return false;
    if (search && !c.contact_name.toLowerCase().includes(search.toLowerCase())) return false;
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
        {conversations.length === 0 && <p className="p-4 text-muted text-center">No conversations yet.</p>}
        {filtered.map(conv => (
          <div 
            key={conv.id} 
            className={`conv-item ${selectedId === conv.id ? 'active' : ''} ${conv.unread_count > 0 ? 'unread' : ''}`}
            onClick={() => onSelectConversation(conv)}
          >
            <div className="conv-avatar">{conv.contact_name?.charAt(0).toUpperCase()}</div>
            <div className="conv-info">
              <div className="conv-name-row">
                <span className="conv-name">{conv.contact_name}</span>
                <span className="conv-time">
                  {new Date(conv.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="conv-msg-row">
                <span className="conv-msg">{conv.last_message}</span>
                {conv.unread_count > 0 && <span className="conv-unread-badge">{conv.unread_count}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
