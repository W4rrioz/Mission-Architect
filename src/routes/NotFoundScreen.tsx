import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)'
    }}>
      <AlertTriangle size={48} color="var(--status-warn)" />
      <h1>404 — Trajectory Lost</h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '480px' }}>
        The requested orbital coordinates do not exist in the mission flight plan.
      </p>
      <Link to="/" style={{ marginTop: 'var(--space-4)' }}>
        <button className="primary">
          <Home size={16} />
          <span>Return to Title</span>
        </button>
      </Link>
    </div>
  );
};
