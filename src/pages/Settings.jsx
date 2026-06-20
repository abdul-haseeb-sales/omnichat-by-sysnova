import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import '../css/dashboard.css';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main-content p-8 w-full overflow-y-auto">
        <div className="mb-8">
          <h1>Account Settings</h1>
          <p className="text-muted">Manage your profile and security preferences</p>
        </div>
        
        <div className="card mb-6 max-w-2xl">
          <h3 className="mb-4">Profile</h3>
          <div className="input-group mb-4">
            <label>Full Name</label>
            <input type="text" className="input-field" defaultValue={user?.user_metadata?.full_name || ''} />
          </div>
          <div className="input-group mb-6">
            <label>Email Address</label>
            <input type="email" className="input-field" value={user?.email || ''} readOnly disabled />
          </div>
          <button className="btn btn-primary">Update Profile</button>
        </div>

        <div className="card mb-6 max-w-2xl" style={{ border: '1px solid var(--error)' }}>
          <h3 className="text-error mb-2">Danger Zone</h3>
          <p className="text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="btn" style={{ background: 'var(--error-bg)', color: 'var(--error)' }}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}
