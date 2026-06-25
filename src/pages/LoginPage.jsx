import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGuest = () => {
    localStorage.setItem('guestMode', 'true');
    navigate('/');
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--color-bg)',
    }}>
      {/* Logo / Brand */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
        }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>✓</span>
        </div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-text-main)',
          margin: 0,
        }}>UniTask</h1>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-caption)',
          marginTop: '4px',
        }}>ניהול מטלות חכם לסטודנטים</p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-large)',
        padding: '32px 28px',
        boxShadow: 'var(--shadow-elevated)',
        border: '1px solid var(--color-border)',
      }}>
        <h2 style={{
          fontSize: 'var(--text-h1)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--color-text-main)',
          marginBottom: '8px',
        }}>ברוך הבא 👋</h2>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-body)',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}>
          התחבר כדי לגשת למטלות שלך, לסנכרן עם Moodle ולנהל את הסמסטר בקלות.
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px',
            borderRadius: 'var(--radius-button)',
            border: '1.5px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            fontWeight: 'var(--weight-semibold)',
            fontSize: 'var(--text-body)',
            transition: 'var(--transition-fast)',
            boxShadow: 'var(--shadow-xs)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          {/* Google Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          המשך עם Google
        </button>
      </div>

      <button
        onClick={handleGuest}
        style={{
          marginTop: '16px',
          background: 'none', border: 'none',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-caption)',
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
        }}
      >
        דלג — צפה בלי להתחבר
      </button>

      <p style={{
        marginTop: '16px',
        color: 'var(--color-text-subtle)',
        fontSize: 'var(--text-xs)',
        textAlign: 'center',
        maxWidth: '280px',
        lineHeight: 1.5,
      }}>
        בלחיצה על "המשך" אתה מסכים לתנאי השירות ומדיניות הפרטיות שלנו.
      </p>
    </div>
  );
}
