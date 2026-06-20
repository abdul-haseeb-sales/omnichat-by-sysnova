import DashboardSidebar from '../components/DashboardSidebar';
import { Facebook, Instagram, MessageCircle, AtSign } from 'lucide-react';
import { useState } from 'react';
import '../css/dashboard.css';

function ChannelCard({ name, icon: Icon, description, color, initialConnected = false }) {
  const [connected, setConnected] = useState(initialConnected);

  return (
    <div className="card channel-card">
      <div className="channel-card-header">
        <div className="channel-icon-wrapper" style={{ background: color }}>
          <Icon size={28} color="white" />
        </div>
        <div>
          <h3 className="mb-1">{name}</h3>
          <span className={`badge ${connected ? 'badge-success' : 'badge-warning'}`}>
            {connected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
      </div>
      <p className="text-muted mt-4 mb-6">{description}</p>
      <button 
        className={`btn w-full ${connected ? 'btn-secondary' : 'btn-primary'}`}
        onClick={() => setConnected(!connected)}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

export default function Channels() {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main-content p-8 w-full overflow-y-auto">
        <div className="mb-8">
          <h1>Connected Channels</h1>
          <p className="text-muted">Connect your social media accounts to receive messages</p>
        </div>
        
        <div className="channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <ChannelCard 
            name="Facebook" 
            icon={Facebook} 
            description="Receive and reply to Facebook Messenger conversations" 
            color="var(--facebook)" 
            initialConnected={true}
          />
          <ChannelCard 
            name="Instagram" 
            icon={Instagram} 
            description="Manage Instagram Direct Messages from your inbox" 
            color="var(--instagram)" 
          />
          <ChannelCard 
            name="Threads" 
            icon={AtSign} 
            description="Connect Threads to handle conversations seamlessly" 
            color="#000000" 
          />
          <ChannelCard 
            name="WhatsApp" 
            icon={MessageCircle} 
            description="Connect WhatsApp Business API for customer messaging" 
            color="var(--whatsapp)" 
            initialConnected={true}
          />
        </div>
      </div>
    </div>
  );
}
