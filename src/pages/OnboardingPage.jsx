import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, User, Shield, ChevronDown } from 'lucide-react';
import { DEGREE_OPTIONS } from '../data/mockDegreeData.js';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [institution, setInstitution] = useState('ono');
  const [degree, setDegree] = useState('ba-mis');
  const [username, setUsername] = useState('');

  function handleConnect() {
    // שמירת פרטי הסטודנט ב-localStorage
    localStorage.setItem('userInstitution', institution);
    localStorage.setItem('userDegree', degree);
    if (username) localStorage.setItem('userUsername', username);
    navigate('/');
  }

  function handleSkip() {
    // גם בדילוג — שמירת ברירת מחדל כדי שה-Moodle sync יעבוד
    if (!localStorage.getItem('userDegree')) {
      localStorage.setItem('userDegree', 'ba-mis');
    }
    navigate('/');
  }

  return (
    <div style={{
      padding: 'var(--space-3)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg)'
    }}>

      {/* Header */}
      <div style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-bold)', marginTop: '8px', marginBottom: '8px' }}>
          חיבור למערכת הלימודים
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body)', lineHeight: '1.5' }}>
          כדי שנוכל לשאוב את המטלות שלך אוטומטית, אנא בחר את מוסד הלימודים והתואר שלך.
        </p>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>

        {/* מוסד לימודים */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>מוסד לימודים</label>
          <div style={inputWrapperStyle}>
            <Building2 size={20} color="var(--color-text-muted)" style={{ marginLeft: '8px', flexShrink: 0 }} />
            <select
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            >
              <option value="ono">הקריה האקדמית אונו</option>
              <option value="tau">אוניברסיטת תל אביב</option>
              <option value="bgu">אוניברסיטת בן גוריון</option>
              <option value="idc">אוניברסיטת רייכמן</option>
              <option value="huji">האוניברסיטה העברית בירושלים</option>
              <option value="technion">הטכניון</option>
              <option value="biu">אוניברסיטת בר אילן</option>
              <option value="haifa">אוניברסיטת חיפה</option>
            </select>
            <ChevronDown size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* תואר */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>תואר לימודים</label>
          <div style={inputWrapperStyle}>
            <GraduationCap size={20} color="var(--color-text-muted)" style={{ marginLeft: '8px', flexShrink: 0 }} />
            <select
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            >
              {DEGREE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={20} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* שם משתמש */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>תעודת זהות / שם משתמש (לסנכרון מדומה)</label>
          <div style={inputWrapperStyle}>
            <User size={20} color="var(--color-text-muted)" style={{ marginLeft: '8px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="הזן מספר ת.ז"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* הערת אבטחה */}
        <div style={{
          backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--radius-button)', padding: 'var(--space-2)',
          display: 'flex', gap: '12px', alignItems: 'flex-start', border: '1px solid var(--color-border)', marginTop: '8px'
        }}>
          <Shield size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-main)', lineHeight: '1.4' }}>
            הפרטים שלך מאובטחים ומוצפנים מקצה לקצה. אנחנו לא שומרים את הסיסמה שלך,
            אלא משתמשים בה רק לצורך הסנכרון הראשוני.
          </p>
        </div>
      </div>

      {/* כפתורים */}
      <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: '40px' }}>
        <button
          onClick={handleConnect}
          style={{
            width: '100%', height: '56px', backgroundColor: 'var(--color-primary)', color: 'white',
            border: 'none', borderRadius: 'var(--radius-button)', fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-bold)', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          שמור והתחל
        </button>

        <button
          onClick={handleSkip}
          style={{
            width: '100%', height: '48px', backgroundColor: 'transparent', color: 'var(--color-text-muted)',
            border: 'none', fontSize: 'var(--text-body)', fontWeight: 'var(--weight-medium)', cursor: 'pointer'
          }}
        >
          דלג לעת עתה
        </button>
      </div>
    </div>
  );
}

// ─── סטיילים ────────────────────────────────────────────────────
const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: 'var(--text-caption)',
  fontWeight: 'var(--weight-bold)',
  color: 'var(--color-text-main)'
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '0 12px',
  position: 'relative',
  height: '48px',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
};

const inputStyle = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  height: '100%',
  outline: 'none',
  fontSize: 'var(--text-body)',
  color: 'var(--color-text-main)',
  fontFamily: 'var(--font-family)',
  width: '100%',
  padding: '0 8px'
};
