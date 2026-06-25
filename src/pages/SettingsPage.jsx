import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Bell, Moon, GraduationCap } from 'lucide-react';
import { DEGREE_OPTIONS } from '../data/mockDegreeData.js';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [moodleUsername, setMoodleUsername] = useState(() => localStorage.getItem('userUsername') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('settings_email') || '');
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const v = localStorage.getItem('settings_notifications');
    return v !== null ? JSON.parse(v) : true;
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [darkMode, setDarkMode] = useState(() => {
    const v = localStorage.getItem('settings_darkMode');
    return v !== null ? JSON.parse(v) : false;
  });
  const [institution, setInstitution] = useState(() => localStorage.getItem('userInstitution') || 'ono');
  const [degree, setDegree] = useState(() => localStorage.getItem('userDegree') || 'ba-mis');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('settings_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  function handleSave() {
    localStorage.setItem('settings_email', email);
    localStorage.setItem('settings_notifications', JSON.stringify(emailNotifications));
    localStorage.setItem('userInstitution', institution);
    localStorage.setItem('userDegree', degree);
    localStorage.setItem('userUsername', moodleUsername);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs = [
    { key: 'personal', label: 'פרופיל', icon: User },
    { key: 'notifications', label: 'התראות', icon: Bell },
    { key: 'general', label: 'כללי', icon: Moon },
  ];

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        display: 'flex', alignItems: 'center', gap: '14px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '38px', height: '38px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-button)', background: 'var(--color-surface-alt)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--color-text-main)',
          }}
        >
          <ArrowRight size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)', margin: 0 }}>הגדרות</h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>ניהול החשבון וההעדפות שלך</p>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Tab Bar */}
        <div style={{
          display: 'flex', gap: '6px', background: 'var(--color-surface)',
          padding: '6px', borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
        }}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1, padding: '9px 6px', border: 'none',
                borderRadius: 'var(--radius-button)',
                background: activeTab === key ? 'var(--color-primary)' : 'transparent',
                color: activeTab === key ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeTab === key ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                fontSize: 'var(--text-xs)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ── Personal Tab ── */}
        {activeTab === 'personal' && (
          <div style={cardStyle}>
            <SectionHeader icon={User} title="פרטי פרופיל" />

            <Field label='כתובת דוא"ל'>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} />
            </Field>

            <Field label="מוסד לימודים">
              <select value={institution} onChange={e => setInstitution(e.target.value)} style={inputStyle}>
                <option value="ono">הקריה האקדמית אונו</option>
                <option value="tau">אוניברסיטת תל אביב</option>
                <option value="bgu">אוניברסיטת בן גוריון</option>
                <option value="idc">אוניברסיטת רייכמן</option>
                <option value="huji">האוניברסיטה העברית בירושלים</option>
                <option value="technion">הטכניון</option>
                <option value="biu">אוניברסיטת בר אילן</option>
                <option value="haifa">אוניברסיטת חיפה</option>
              </select>
            </Field>

            <Field label="תואר לימודים">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <GraduationCap size={16} style={{ position: 'absolute', right: '12px', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                <select value={degree} onChange={e => setDegree(e.target.value)} style={{ ...inputStyle, paddingRight: '36px' }}>
                  {DEGREE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </Field>

            <Field label="שם משתמש Moodle">
              <input type="text" value={moodleUsername} onChange={e => setMoodleUsername(e.target.value)} placeholder="תעודת זהות או קוד משתמש" style={inputStyle} />
            </Field>

            <button onClick={handleSave} style={{
              width: '100%', padding: '12px', border: 'none',
              borderRadius: 'var(--radius-button)',
              background: saved ? 'var(--color-success)' : 'var(--color-primary)',
              color: '#fff', fontWeight: 'var(--weight-semibold)',
              fontSize: 'var(--text-body)', cursor: 'pointer',
              transition: 'background 0.2s ease', marginTop: '4px',
            }}>
              {saved ? '✓ נשמר בהצלחה!' : 'שמור שינויים'}
            </button>
          </div>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === 'notifications' && (
          <div style={cardStyle}>
            <SectionHeader icon={Bell} title="התראות" />

            <ToggleRow
              label="התראות מייל על מטלות דחופות"
              description="קבל עדכון כשמתקרב תאריך הגשה"
              checked={emailNotifications}
              onChange={e => {
                setEmailNotifications(e.target.checked);
                localStorage.setItem('settings_notifications', JSON.stringify(e.target.checked));
              }}
            />
          </div>
        )}

        {/* ── General Tab ── */}
        {activeTab === 'general' && (
          <div style={cardStyle}>
            <SectionHeader icon={Moon} title="תצוגה" />

            <ToggleRow
              label="מצב כהה"
              description={darkMode ? 'מצב כהה פעיל' : 'מצב בהיר פעיל'}
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
        background: 'var(--color-primary-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color="var(--color-primary)" />
      </div>
      <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)' }}>{title}</h2>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block', fontSize: 'var(--text-caption)',
        fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-muted)',
        marginBottom: '6px',
      }}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '16px', cursor: 'pointer', padding: '14px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div>
        <p style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-body)', color: 'var(--color-text-main)' }}>{label}</p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{description}</p>
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)', flexShrink: 0 }} />
    </label>
  );
}

// ── Shared Styles ────────────────────────────────────────────────
const cardStyle = {
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-card)',
  border: '1px solid var(--color-border)',
  padding: '20px',
  boxShadow: 'var(--shadow-card)',
};

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--color-input-border)',
  borderRadius: 'var(--radius-button)',
  background: 'var(--color-input-bg)',
  color: 'var(--color-text-main)',
  fontSize: 'var(--text-body)', outline: 'none',
  boxSizing: 'border-box',
};
