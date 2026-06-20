import { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import ConversationList from '../components/ConversationList';
import ChatView from '../components/ChatView';
import ContactPanel from '../components/ContactPanel';
import '../css/dashboard.css';

export default function Dashboard() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat' | 'contact'

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setMobileView('chat');
  };

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      
      <div className={`dashboard-panel-list ${mobileView === 'list' ? 'mobile-active' : ''}`}>
        <ConversationList 
          selectedId={selectedConversation?.id} 
          onSelectConversation={handleSelectConversation} 
        />
      </div>

      <div className={`dashboard-panel-chat ${mobileView === 'chat' ? 'mobile-active' : ''}`}>
        <ChatView 
          conversation={selectedConversation} 
          onToggleContact={() => {
            setShowContactPanel(!showContactPanel);
            if (!showContactPanel && window.innerWidth <= 768) {
              setMobileView('contact');
            }
          }}
          onBack={() => setMobileView('list')}
        />
      </div>

      {showContactPanel && (
        <div className={`dashboard-panel-contact ${mobileView === 'contact' ? 'mobile-active' : ''}`}>
          <ContactPanel 
            conversation={selectedConversation} 
            onClose={() => {
              setShowContactPanel(false);
              setMobileView('chat');
            }}
          />
        </div>
      )}
    </div>
  );
}
