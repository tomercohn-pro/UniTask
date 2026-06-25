import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Sparkles } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '72px',
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: 'var(--shadow-nav)',
      paddingBottom: '8px',
      zIndex: 100,
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      <NavItem icon={Home}     label="ראשי"  active={isActive('/')}        onClick={() => navigate('/')} />
      <NavItem icon={BookOpen} label="קורסים" active={isActive('/courses')} onClick={() => navigate('/courses')} />
      <NavItem icon={Sparkles} label="סורק"   active={isActive('/scanner')} onClick={() => navigate('/scanner')} />
    </nav>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        width: '72px',
        height: '52px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-button)',
        transition: 'var(--transition-fast)',
        color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
        position: 'relative',
      }}
      aria-label={label}
    >
      {/* Active pill background */}
      {active && (
        <span style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-button)',
          backgroundColor: 'var(--color-primary-light)',
        }} />
      )}
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
      </span>
      <span style={{
        position: 'relative',
        fontSize: '10px',
        fontWeight: active ? 'var(--weight-bold)' : 'var(--weight-medium)',
        letterSpacing: '0.01em',
      }}>
        {label}
      </span>
    </button>
  );
}
