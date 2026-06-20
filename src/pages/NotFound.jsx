import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '6rem', background: 'linear-gradient(135deg, var(--brand-500), var(--accent-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>404</h1>
      <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Return Home</Link>
    </div>
  );
}
