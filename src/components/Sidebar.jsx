import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Sparkles, Settings, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient.js';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { path: '/',        icon: Home,      label: 'דשבורד' },
  { path: '/courses', icon: BookOpen,  label: 'קורסים' },
  { path: '/scanner', icon: Sparkles,  label: 'סורק AI' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user ?? null));
  }, []);

  const isActive = (path) => location.pathname === path;
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'משתמש';
  const userInitial = userName[0]?.toUpperCase();

  return (
    <aside
      className="desktop-sidebar"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: 'var(--sidebar-width)',
        flexShrink: 0,
        background: 'var(--color-surface)',
        borderLeft: '1px solid var(--color-border)',
        flexDirection: 'column',
        zIndex: 200,
        boxShadow: '-2px 0 12px rgba(15,23,42,0.04)',
        overflowY: 'auto',
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        padding: '28px 20px 24px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '18px', lineHeight: 1, color: '#fff' }}>✓</span>
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-main)', margin: 0, lineHeight: 1.2 }}>UniTask</h1>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, marginTop: '2px' }}>ניהול מטלות חכם</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-subtle)', letterSpacing: '0.08em', padding: '4px 8px 10px', textTransform: 'uppercase' }}>
          ניווט
        </p>

        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', border: 'none', borderRadius: '10px',
                background: active ? 'var(--color-primary)' : 'transparent',
                color: active ? '#fff' : 'var(--color-text-muted)',
                fontWeight: active ? '600' : '500',
                fontSize: '14px', cursor: 'pointer', textAlign: 'right',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--color-surface-alt)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} style={{ flexShrink: 0 }} />
              {label}
            </button>
          );
        })}

        <div style={{ height: '1px', background: 'var(--color-border)', margin: '12px 4px' }} />

        <button
          onClick={() => navigate('/settings')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', border: 'none', borderRadius: '10px',
            background: isActive('/settings') ? 'var(--color-primary)' : 'transparent',
            color: isActive('/settings') ? '#fff' : 'var(--color-text-muted)',
            fontWeight: isActive('/settings') ? '600' : '500',
            fontSize: '14px', cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { if (!isActive('/settings')) e.currentTarget.style.background = 'var(--color-surface-alt)'; }}
          onMouseLeave={e => { if (!isActive('/settings')) e.currentTarget.style.background = 'transparent'; }}
        >
          <Settings size={18} strokeWidth={isActive('/settings') ? 2.5 : 1.8} />
          הגדרות
        </button>
      </nav>

      {/* ── User Profile ── */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px',
          borderRadius: '10px',
          background: 'var(--color-surface-alt)',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{userInitial}</span>
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '9px', border: '1px solid var(--color-border)', borderRadius: '10px',
            background: 'transparent', color: 'var(--color-text-muted)',
            fontSize: '13px', fontWeight: '500', cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FECACA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        >
          <LogOut size={15} />
          התנתק
        </button>
      </div>
    </aside>
  );
}
