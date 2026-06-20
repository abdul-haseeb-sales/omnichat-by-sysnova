import { X } from 'lucide-react';

export default function ContactPanel({ conversation, onClose }) {
  if (!conversation) return null;

  return (
    <div className="contact-panel-container">
      <div className="contact-panel-header">
        <h3>Contact Details</h3>
        <button onClick={onClose} className="contact-close-btn">
          <X size={20} />
        </button>
      </div>
      
      <div className="contact-panel-body">
        <div className="contact-profile text-center mb-6">
          <div className="contact-large-avatar mx-auto mb-3">
            {conversation.contactInitial}
          </div>
          <h2>{conversation.contactName}</h2>
          <span className={`badge badge-${conversation.channel} mt-2`}>{conversation.channel}</span>
        </div>

        <div className="divider" />

        <div className="contact-info-section">
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value capitalize">{conversation.status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Active</span>
            <span className="info-value">{conversation.timestamp}</span>
          </div>
        </div>

        <div className="divider" />

        <div className="contact-actions mt-6">
          <button className="btn btn-secondary w-full">Mark as Resolved</button>
        </div>
      </div>
    </div>
  );
}
