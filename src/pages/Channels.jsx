import DashboardSidebar from '../components/DashboardSidebar';
import { Facebook, Instagram, MessageCircle, AtSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import '../css/dashboard.css';

// Using a generic component, but connecting uses FB SDK
function ChannelCard({ name, icon: Icon, description, color, channelType, onConnect }) {
  const [connected, setConnected] = useState(false);

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
        onClick={() => {
          if (!connected) onConnect(channelType);
        }}
      >
        {connected ? 'Settings' : 'Connect'}
      </button>
    </div>
  );
}

export default function Channels() {
  
  useEffect(() => {
    // Load FB SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : import.meta.env.VITE_META_APP_ID || 'YOUR_META_APP_ID_HERE', // User needs to set this in .env
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
    };
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleConnect = (channelType) => {
    if (!window.FB) {
      alert("Facebook SDK is still loading or failed to load.");
      return;
    }

    window.FB.login(async (response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        const userID = response.authResponse.userID;
        
        // In a real app, you would exchange this for a long-lived page access token.
        // For this demo, we save the user access token and generic page ID.
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) return;

          // Ask user for their Page ID or WA ID
          const pageId = prompt(`Enter your ${channelType} Page ID / Phone ID:`);
          if (!pageId) return;

          const { error } = await supabase
            .from('user_channels')
            .insert({
              user_id: userData.user.id,
              channel_type: channelType,
              page_id: pageId,
              access_token: accessToken,
              page_name: `${channelType} Account`
            });

          if (error) {
            console.error("Error saving channel:", error);
            alert("Failed to connect channel. Ensure you ran database_v2.sql.");
          } else {
            alert(`Successfully connected ${channelType}!`);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'pages_show_list,pages_messaging,instagram_manage_messages,whatsapp_business_messaging'});
  };

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
            channelType="facebook"
            onConnect={handleConnect}
          />
          <ChannelCard 
            name="Instagram" 
            icon={Instagram} 
            description="Manage Instagram Direct Messages from your inbox" 
            color="var(--instagram)" 
            channelType="instagram"
            onConnect={handleConnect}
          />
          <ChannelCard 
            name="Threads" 
            icon={AtSign} 
            description="Connect Threads to handle conversations seamlessly" 
            color="#000000" 
            channelType="threads"
            onConnect={handleConnect}
          />
          <ChannelCard 
            name="WhatsApp" 
            icon={MessageCircle} 
            description="Connect WhatsApp Business API for customer messaging" 
            color="var(--whatsapp)" 
            channelType="whatsapp"
            onConnect={handleConnect}
          />
        </div>
      </div>
    </div>
  );
}
