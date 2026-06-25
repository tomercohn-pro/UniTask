import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { getMockSyncData } from '../data/mockDegreeData.js';
import { RefreshCw, Trash2, Loader2, Settings, Info, X, Edit2, LogOut, Plus, CheckCircle2, Circle, Flame, Clock } from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'בוקר טוב';
  if (h >= 12 && h < 17) return 'צהריים טובים';
  return 'ערב טוב';
}

const TASKS_KEY = 'dashboardTasks';
const DELETED_KEY = 'dashboardDeletedTasks';

const GUEST_TASKS = [
  { id: 'g1', title: 'פרויקט SQL: בניית מסד נתונים לניהול לקוחות', due_date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0,10), is_urgent: true,  is_completed: false },
  { id: 'g2', title: 'מצגת BI: דשבורד ניהולי ב-Power BI',           due_date: new Date(Date.now() + 5 * 86400000).toISOString().slice(0,10), is_urgent: false, is_completed: false },
  { id: 'g3', title: 'עבודה: מדיניות אבטחת מידע לארגון בינוני',     due_date: new Date(Date.now() + 9 * 86400000).toISOString().slice(0,10), is_urgent: false, is_completed: false },
  { id: 'g4', title: 'בחינה: ניתוח ועיצוב מערכות מידע',              due_date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0,10), is_urgent: true,  is_completed: false },
  { id: 'g5', title: 'תרגיל: ניתוח נתונים ב-Excel מתקדם',           due_date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0,10), is_urgent: false, is_completed: true  },
];

function loadLS(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}

function formatDate(d) {
  if (!d) return null;
  const date = new Date(d);
  const today = new Date();
  const diff = Math.ceil((date - today) / 86400000);
  if (diff === 0) return 'היום';
  if (diff === 1) return 'מחר';
  if (diff < 0) return `איחרת ב-${Math.abs(diff)} ימים`;
  if (diff <= 7) return `בעוד ${diff} ימים`;
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const isGuest = !localStorage.getItem('supabase.auth.token') && localStorage.getItem('guestMode') === 'true';
  const [tasks, setTasks] = useState(() => isGuest ? GUEST_TASKS : (loadLS(TASKS_KEY) ?? []));
  const [deletedTasks, setDeletedTasks] = useState(() => loadLS(DELETED_KEY) ?? []);
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskIsUrgent, setNewTaskIsUrgent] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showInfo, setShowInfo] = useState(false);
  const [isInfoClosing, setIsInfoClosing] = useState(false);
  const [infoButtonRect, setInfoButtonRect] = useState(null);
  const infoButtonRef = useRef(null);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userMenuStyle, setUserMenuStyle] = useState({ top: 0, left: 0 });
  const userButtonRef = useRef(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [syncToast, setSyncToast] = useState(null); // { message, success }
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [tasksLoading, setTasksLoading] = useState(true);
  const autoUrgentProcessed = useRef(new Set());

  const fetchTasks = useCallback(async () => {
    if (isGuest) { setTasksLoading(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) { setTasksLoading(false); return; }
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId);
    if (error) console.error('שגיאה בשליפת מטלות:', error);
    else setTasks(data);
    setTasksLoading(false);
  }, [isGuest]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user ?? null));
  }, []);
  useEffect(() => { try { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); } catch {} }, [tasks]);
  useEffect(() => { try { localStorage.setItem(DELETED_KEY, JSON.stringify(deletedTasks)); } catch {} }, [deletedTasks]);

  // ── Auto-urgent: מטלות שנשארו ≤2 ימים הופכות דחופות ➜ מייל אוטומטי
  useEffect(() => {
    if (tasks.length === 0 || !user) return;
    const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const toMakeUrgent = tasks.filter(t =>
      !t.is_urgent && !t.is_completed && t.due_date &&
      new Date(t.due_date) <= twoDaysFromNow &&
      !autoUrgentProcessed.current.has(t.id)
    );
    if (toMakeUrgent.length === 0) return;
    toMakeUrgent.forEach(t => autoUrgentProcessed.current.add(t.id));

    Promise.all(toMakeUrgent.map(t =>
      supabase.from('tasks').update({ is_urgent: true }).eq('id', t.id)
    )).then(async () => {
      setTasks(prev => prev.map(t =>
        toMakeUrgent.find(u => u.id === t.id) ? { ...t, is_urgent: true } : t
      ));

      setSyncToast({
        message: `🔥 ${toMakeUrgent.length} מטלות הפכו לדחופות!`,
        success: true,
      });
      setTimeout(() => setSyncToast(null), 5000);
    });
  }, [tasks, user]);

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  async function handleMoodleSync() {
    if (isSyncing) return;
    setIsSyncing(true);
    const degreeKey = localStorage.getItem('userDegree') ?? 'ba-mis';
    const institution = localStorage.getItem('userInstitution') ?? 'ono';
    const institutionNames = {
      ono: 'הקריה האקדמית אונו', tau: 'אוניברסיטת תל אביב',
      bgu: 'אוניברסיטת בן גוריון', idc: 'אוניברסיטת רייכמן',
      huji: 'האוניברסיטה העברית', technion: 'הטכניון',
      biu: 'אוניברסיטת בר אילן', haifa: 'אוניברסיטת חיפה',
    };
    const institutionLabel = institutionNames[institution] ?? 'מוסד הלימודים';
    setSyncStatus(`מתחבר ל-${institutionLabel}...`);
    await delay(1500);
    setSyncStatus('מאמת זהות...');
    await delay(1200);
    setSyncStatus('שואב מטלות...');
    await delay(1300);

    // אקראי: 30% סיכוי לאין מטלות חדשות, 70% סיכוי ל-1–5 מטלות
    const newTaskCount = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 5) + 1;

    const showToast = (message, success = true) => {
      setSyncToast({ message, success });
      setTimeout(() => setSyncToast(null), 3500);
    };

    if (newTaskCount === 0) {
      setIsSyncing(false);
      setSyncStatus('');
      showToast('אין מטלות חדשות ב-Moodle', true);
      return;
    }

    const { courseNames, taskRows } = getMockSyncData(degreeKey, newTaskCount);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) { setSyncStatus('שגיאה: לא מחובר.'); setIsSyncing(false); return; }
      await supabase.from('courses').insert(courseNames.map(name => ({ name, user_id: userId })));
      const { error: tasksError } = await supabase.from('tasks').insert(taskRows.map(t => ({ ...t, user_id: userId })));
      if (tasksError) { showToast('שגיאה בסנכרון', false); }
      else {
        await fetchTasks();
        showToast(`נוספו ${newTaskCount} מטלות חדשות 🎉`, true);
      }
    } catch (e) {
      showToast('שגיאה בסנכרון', false);
    } finally {
      setIsSyncing(false);
      setSyncStatus('');
    }
  }

  const filteredTasks = tasks
    .filter(t => activeTab === 'urgent' ? t.is_urgent : activeTab === 'completed' ? t.is_completed : true)
    .sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    });

  const counts = {
    all: tasks.length,
    urgent: tasks.filter(t => t.is_urgent).length,
    completed: tasks.filter(t => t.is_completed).length,
  };

  async function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    const { data, error } = await supabase.from('tasks').insert([{
      title: newTaskTitle, due_date: newTaskDueDate || null,
      is_urgent: newTaskIsUrgent, is_completed: false, user_id: userId,
    }]).select();
    if (!error && data) {
      setTasks([...tasks, data[0]]);
      setNewTaskTitle(''); setNewTaskDueDate(''); setNewTaskIsUrgent(false);
      setShowAddForm(false);
    }
  }

  async function handleToggleComplete(id, cur) {
    const { error } = await supabase.from('tasks').update({ is_completed: !cur }).eq('id', id);
    if (!error) setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !cur } : t));
  }

  async function handleToggleUrgent(id, cur) {
    const { error } = await supabase.from('tasks').update({ is_urgent: !cur }).eq('id', id);
    if (!error) setTasks(tasks.map(t => t.id === id ? { ...t, is_urgent: !cur } : t));
  }

  function startEditingTask(task) {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.due_date || '');
  }

  async function handleSaveTask(id) {
    if (!editTitle.trim()) return;
    const { error } = await supabase.from('tasks').update({ title: editTitle.trim(), due_date: editDueDate || null }).eq('id', id);
    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, title: editTitle.trim(), due_date: editDueDate || null } : t));
      setEditingTaskId(null);
    }
  }

  async function handleDeleteTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) { setTasks(tasks.filter(t => t.id !== id)); setDeletedTasks([task, ...deletedTasks]); }
  }

  async function handleRestoreTask(id) {
    const task = deletedTasks.find(t => t.id === id);
    if (!task) return;
    const { id: _old, ...rest } = task;
    const { data, error } = await supabase.from('tasks').insert([rest]).select();
    if (!error) { setDeletedTasks(deletedTasks.filter(t => t.id !== id)); setTasks([data[0], ...tasks]); }
  }

  function toggleSelectTask(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds];
    const toDelete = tasks.filter(t => ids.includes(t.id));
    await Promise.all(ids.map(id => supabase.from('tasks').delete().eq('id', id)));
    setTasks(prev => prev.filter(t => !ids.includes(t.id)));
    setDeletedTasks(prev => [...toDelete, ...prev]);
    setSelectedIds(new Set());
    setSelectMode(false);
  }

  async function handleBulkUrgent() {
    const ids = [...selectedIds];
    await Promise.all(ids.map(id => supabase.from('tasks').update({ is_urgent: true }).eq('id', id)));
    setTasks(prev => prev.map(t => ids.includes(t.id) ? { ...t, is_urgent: true } : t));
    setSelectedIds(new Set());
    setSelectMode(false);
  }

  const closeInfo = () => {
    setIsInfoClosing(true);
    setTimeout(() => { setShowInfo(false); setIsInfoClosing(false); setInfoButtonRect(null); }, 220);
  };

  const getInfoTransform = () => {
    if (!infoButtonRect) return showInfo && !isInfoClosing ? 'scale(1)' : 'scale(0.9) translateY(8px)';
    if (showInfo && !isInfoClosing) return 'scale(1)';
    const cx = infoButtonRect.left + infoButtonRect.width / 2 - window.innerWidth / 2;
    const cy = infoButtonRect.top + infoButtonRect.height / 2 - window.innerHeight / 2;
    return `translate(${cx}px, ${cy}px) scale(0.15)`;
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'שלום';

  return (
    <div className="dash-root" style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes toastFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @media (max-width: 767px) {
          .dash-root { padding-bottom: 100px !important; }
        }
      `}</style>

      {/* ── Guest Banner ── */}
      {isGuest && (
        <div style={{
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          color: '#fff',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-medium)' }}>
            👁 שים לב — זוהי סימולציה בלבד. כדי לנהל מטלות אמיתיות ולשמור נתונים, יש להתחבר עם Google.
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('guestMode');
              navigate('/login');
            }}
            style={{
              padding: '7px 16px', border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: 'var(--radius-pill)',
              background: 'transparent', color: '#fff',
              fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-caption)',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            התחבר עם Google →
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="dash-header" style={{
        padding: '20px 20px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
            {getGreeting()} 👋
          </p>
          <h1 style={{ fontSize: 'var(--text-display)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)', lineHeight: 1.2 }}>
            הדשבורד שלי
          </h1>
        </div>

        {/* כפתור Info בדסקטופ */}
        <div style={{ display: 'none' }} className="header-info-desktop">
          <style>{`.header-info-desktop { display: none !important; } @media(min-width:768px){ .header-info-desktop { display: flex !important; } }`}</style>
          <button
            ref={infoButtonRef}
            onClick={() => {
              if (infoButtonRef.current) setInfoButtonRect(infoButtonRef.current.getBoundingClientRect());
              setShowInfo(true); setIsInfoClosing(false);
            }}
            style={iconBtnStyle}
          >
            <Info size={18} />
          </button>
        </div>

        {/* כפתורי header — מוצגים רק במובייל, בדסקטופ יש Sidebar */}
        <div className="header-actions-mobile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <style>{`.header-actions-mobile { display: flex; } @media(min-width:768px){ .header-actions-mobile { display: none !important; } }`}</style>
          <button
            ref={infoButtonRef}
            onClick={() => {
              if (infoButtonRef.current) setInfoButtonRect(infoButtonRef.current.getBoundingClientRect());
              setShowInfo(true); setIsInfoClosing(false);
            }}
            style={{ ...iconBtnStyle }}
            aria-label="מידע"
          >
            <Info size={18} />
          </button>
          <button onClick={() => navigate('/settings')} style={iconBtnStyle} aria-label="הגדרות">
            <Settings size={18} />
          </button>
          <button
            ref={userButtonRef}
            onClick={() => {
              if (userButtonRef.current) {
                const r = userButtonRef.current.getBoundingClientRect();
                setUserMenuStyle({ top: r.bottom + 8, left: Math.min(r.right - 10, window.innerWidth - 180) });
              }
              setShowUserMenu(p => !p);
            }}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              border: '2px solid var(--color-border)',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden', padding: 0,
            }}
          >
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '14px', fontWeight: 'var(--weight-bold)', color: '#fff' }}>{userName[0]?.toUpperCase()}</span>
            }
          </button>
        </div>
      </div>

      {/* User Menu */}
      {showUserMenu && (
        <div
          onClick={() => setShowUserMenu(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', top: userMenuStyle.top, left: userMenuStyle.left,
              transform: 'translateX(-50%)',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-elevated)',
              zIndex: 1000, padding: '8px', minWidth: '160px',
              animation: 'fadeSlideIn 0.15s ease',
            }}
          >
            <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '6px' }}>
              <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-main)' }}>{userName}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{user?.email}</p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', border: 'none', borderRadius: 'var(--radius-button)',
                background: '#FEF2F2', color: '#DC2626',
                cursor: 'pointer', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)',
              }}
            >
              <LogOut size={15} />
              התנתק
            </button>
          </div>
        </div>
      )}

      {/* ── Stats Strip ── */}
      <div className="dash-section" style={{ padding: '20px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
        {[
          { label: 'סה"כ', value: counts.all, color: 'var(--color-primary)' },
          { label: 'דחופות', value: counts.urgent, color: '#DC2626' },
          { label: 'הושלמו', value: counts.completed, color: 'var(--color-success)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: 'var(--color-surface)', borderRadius: 'var(--radius-card)',
            padding: '14px 12px', border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)', textAlign: 'center',
          }}>
            <p style={{ fontSize: '22px', fontWeight: 'var(--weight-bold)', color: s.color, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Moodle Sync ── */}
      <div className="dash-section" style={{ padding: '16px 20px 0' }}>
        <button
          onClick={handleMoodleSync}
          disabled={isSyncing}
          style={{
            width: '100%', height: '52px',
            background: isSyncing ? 'var(--color-surface-alt)' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            border: isSyncing ? '1px solid var(--color-border)' : 'none',
            borderRadius: 'var(--radius-button)',
            color: isSyncing ? 'var(--color-text-muted)' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-body)',
            boxShadow: isSyncing ? 'none' : '0 4px 14px rgba(79,70,229,0.35)',
            transition: 'var(--transition-normal)',
          }}
        >
          {isSyncing
            ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />{syncStatus || 'מסנכרן...'}</>
            : <><RefreshCw size={17} />סנכרון Moodle</>
          }
        </button>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="dash-section" style={{ padding: '16px 20px 0' }}>
        <div style={{
          display: 'flex', gap: '6px',
          background: 'var(--color-surface)', padding: '6px',
          borderRadius: 'var(--radius-card)', border: '1px solid var(--color-border)',
        }}>
          {[
            { key: 'all', label: `הכל (${counts.all})` },
            { key: 'urgent', label: `דחוף (${counts.urgent})` },
            { key: 'completed', label: `הושלם (${counts.completed})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '9px 8px', border: 'none',
                borderRadius: 'var(--radius-button)',
                background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.key ? '#fff' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab.key ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                fontSize: 'var(--text-caption)', cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Task List ── */}
      <div className="dash-section" style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)' }}>המטלות שלי</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {selectMode && (
              <button
                onClick={() => {
                  const allIds = new Set(filteredTasks.map(t => t.id));
                  const allSelected = filteredTasks.every(t => selectedIds.has(t.id));
                  setSelectedIds(allSelected ? new Set() : allIds);
                }}
                style={{
                  padding: '7px 12px', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-surface-alt)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)',
                  cursor: 'pointer',
                }}
              >
                {filteredTasks.every(t => selectedIds.has(t.id)) ? 'בטל הכל' : 'בחר הכל'}
              </button>
            )}
            <button
              onClick={() => { setSelectMode(p => !p); setSelectedIds(new Set()); }}
              style={{
                padding: '7px 12px', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-pill)',
                background: selectMode ? 'var(--color-primary)' : 'var(--color-surface)',
                color: selectMode ? '#fff' : 'var(--color-text-muted)',
                fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)',
                cursor: 'pointer',
              }}
            >
              {selectMode ? 'ביטול' : 'בחר'}
            </button>
            <button
              onClick={() => setShowAddForm(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 12px', border: 'none',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)',
                cursor: 'pointer',
              }}
            >
              <Plus size={15} /> הוסף
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-primary)', padding: '16px',
            boxShadow: '0 0 0 4px rgba(79,70,229,0.08)',
            animation: 'fadeSlideIn 0.18s ease',
          }}>
            <input
              autoFocus
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              placeholder="שם המטלה..."
              style={{ ...inputStyle, marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={e => setNewTaskDueDate(e.target.value)}
                style={{ ...inputStyle, flex: 1, minWidth: '140px' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={newTaskIsUrgent} onChange={e => setNewTaskIsUrgent(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#DC2626' }} />
                <span style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--weight-medium)', color: '#DC2626' }}>דחוף 🔥</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={handleAddTask} style={{ ...primaryBtnStyle, flex: 1 }}>הוסף מטלה</button>
              <button onClick={() => { setShowAddForm(false); setNewTaskTitle(''); }} style={{ ...ghostBtnStyle }}>ביטול</button>
            </div>
          </div>
        )}

        <div className="task-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasksLoading ? (
          [1,2,3].map(i => <TaskSkeleton key={i} />)
        ) : filteredTasks.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'var(--color-text-muted)', fontSize: 'var(--text-body)',
          }}>
            <p style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</p>
            <p style={{ fontWeight: 'var(--weight-semibold)' }}>
              {activeTab === 'completed' ? 'עוד לא הושלמו מטלות' : 'אין מטלות פה'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              editing={editingTaskId === task.id}
              editTitle={editTitle}
              editDueDate={editDueDate}
              setEditTitle={setEditTitle}
              setEditDueDate={setEditDueDate}
              onToggleComplete={() => handleToggleComplete(task.id, task.is_completed)}
              onToggleUrgent={() => handleToggleUrgent(task.id, task.is_urgent)}
              onEdit={() => startEditingTask(task)}
              onSave={() => handleSaveTask(task.id)}
              onCancel={() => setEditingTaskId(null)}
              onDelete={() => handleDeleteTask(task.id)}
              selectMode={selectMode}
              selected={selectedIds.has(task.id)}
              onSelect={() => toggleSelectTask(task.id)}
            />
          ))
        )}
        </div>
      </div>

      {/* ── Deleted Tasks ── */}
      <div className="dash-section" style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--color-surface)', borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)', overflow: 'hidden',
        }}>
          <button
            onClick={() => setShowDeletedTasks(p => !p)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px', border: 'none', background: 'none', cursor: 'pointer',
              color: 'var(--color-text-main)',
            }}
          >
            <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-body)' }}>
              מטלות שנמחקו ({deletedTasks.length})
            </span>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
              {showDeletedTasks ? 'סגור ▲' : 'פתח ▼'}
            </span>
          </button>

          {showDeletedTasks && (
            <div style={{ borderTop: '1px solid var(--color-border)', padding: '12px' }}>
              {deletedTasks.length === 0 ? (
                <p style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)', textAlign: 'center' }}>
                  אין מטלות שנמחקו
                </p>
              ) : deletedTasks.map(task => (
                <div key={task.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderRadius: 'var(--radius-button)',
                  background: 'var(--color-surface-alt)', marginBottom: '6px',
                }}>
                  <div>
                    <p style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-text-main)', fontSize: 'var(--text-caption)', textDecoration: 'line-through', opacity: 0.7 }}>{task.title}</p>
                    {task.due_date && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{formatDate(task.due_date)}</p>}
                  </div>
                  <button
                    onClick={() => handleRestoreTask(task.id)}
                    style={{ ...ghostBtnStyle, padding: '7px 12px', fontSize: 'var(--text-xs)' }}
                  >
                    שחזר
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sync / Auto-urgent Toast ── */}
      {syncToast && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          animation: 'toastSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 20px',
            borderRadius: 'var(--radius-pill)',
            background: syncToast.success ? 'var(--color-success)' : 'var(--color-error)',
            color: '#fff',
            fontWeight: 'var(--weight-semibold)',
            fontSize: 'var(--text-body)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}>
            {syncToast.message}
          </div>
        </div>
      )}

      {/* ── Bulk Action Bar ── */}
      {selectMode && selectedIds.size > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2001,
          animation: 'toastSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)', fontWeight: 'var(--weight-medium)' }}>
              {selectedIds.size} נבחרו
            </span>
            <button
              onClick={handleBulkUrgent}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', border: 'none',
                borderRadius: 'var(--radius-pill)',
                background: '#FEF2F2', color: '#DC2626',
                fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)',
                cursor: 'pointer',
              }}
            >
              🔥 סמן דחוף
            </button>
            <button
              onClick={handleBulkDelete}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', border: 'none',
                borderRadius: 'var(--radius-pill)',
                background: '#DC2626', color: '#fff',
                fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)',
                cursor: 'pointer',
              }}
            >
              🗑 מחק הכל
            </button>
          </div>
        </div>
      )}

      {/* ── Info Dialog ── */}
      {(showInfo || isInfoClosing) && (
        <div
          onClick={closeInfo}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
            opacity: showInfo && !isInfoClosing ? 1 : 0,
            transition: 'opacity 200ms ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '400px',
              background: 'var(--color-surface)', borderRadius: 'var(--radius-large)',
              padding: '24px', boxShadow: 'var(--shadow-elevated)',
              border: '1px solid var(--color-border)',
              transform: getInfoTransform(),
              transition: 'transform 220ms ease',
              position: 'relative',
            }}
          >
            <button onClick={closeInfo} style={{ position: 'absolute', top: '16px', left: '16px', ...iconBtnStyle }}>
              <X size={18} />
            </button>
            <h2 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-bold)', marginBottom: '16px' }}>איך להשתמש</h2>
            {[
              { icon: '📋', title: 'דשבורד', text: 'ראה ונהל את כל המטלות שלך. סמן כבוצע, ערוך, מחק ושחזר.' },
              { icon: '🔄', title: 'סנכרון Moodle', text: 'שאיבת מטלות אוטומטית לפי התואר שהגדרת.' },
              { icon: '📚', title: 'קורסים', text: 'ניהול הסילבוס והקורסים שלך.' },
              { icon: '✨', title: 'סורק', text: 'העלה קובץ — המערכת תזהה מטלות ותאריכים אוטומטית.' },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', gap: '12px', padding: '12px',
                borderRadius: 'var(--radius-button)', background: 'var(--color-surface-alt)',
                marginBottom: '8px',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-caption)', color: 'var(--color-text-main)' }}>{item.title}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.5 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Task Skeleton ────────────────────────────────────────────────
function TaskSkeleton() {
  return (
    <div style={{
      background: 'var(--color-surface)', borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-border)', padding: '14px 16px',
    }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton-line {
          border-radius: 6px;
          background: linear-gradient(90deg, var(--color-surface-alt) 25%, var(--color-border) 50%, var(--color-surface-alt) 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease infinite;
        }
      `}</style>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="skeleton-line" style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0 }} />
        <div className="skeleton-line" style={{ flex: 1, height: 16 }} />
        <div className="skeleton-line" style={{ width: 60, height: 16 }} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingRight: '30px' }}>
        <div className="skeleton-line" style={{ width: 70, height: 12 }} />
      </div>
    </div>
  );
}

// ── Task Card Component ──────────────────────────────────────────
function TaskCard({ task, editing, editTitle, editDueDate, setEditTitle, setEditDueDate,
  onToggleComplete, onToggleUrgent, onEdit, onSave, onCancel, onDelete,
  selectMode, selected, onSelect }) {

  const dateLabel = task.due_date ? formatDate(task.due_date) : null;
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.is_completed;

  return (
    <div
      onClick={selectMode ? onSelect : undefined}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: selected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: selected ? '0 0 0 3px rgba(79,70,229,0.12)' : 'var(--shadow-card)',
        borderRight: selected ? '2px solid var(--color-primary)' : task.is_urgent ? '3px solid #DC2626' : task.is_completed ? '3px solid var(--color-success)' : '1px solid var(--color-border)',
        padding: '14px 16px',
        animation: 'fadeSlideIn 0.15s ease',
        transition: 'box-shadow 0.15s ease, border 0.15s ease',
        cursor: selectMode ? 'pointer' : 'default',
        userSelect: selectMode ? 'none' : 'auto',
      }}>
      {editing ? (
        // ── Edit Mode ──
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            autoFocus
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel(); }}
            style={inputStyle}
          />
          <input
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onSave} style={{ ...primaryBtnStyle, flex: 1, padding: '9px' }}>שמור</button>
            <button onClick={onCancel} style={ghostBtnStyle}>ביטול</button>
          </div>
        </div>
      ) : (
        // ── View Mode ──
        <>
          {/* Row 1: select checkbox (if in select mode) + complete toggle + title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {selectMode ? (
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '2px',
                border: selected ? 'none' : '2px solid var(--color-border)',
                background: selected ? 'var(--color-primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selected && <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>✓</span>}
              </div>
            ) : (
              <button
                onClick={onToggleComplete}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: task.is_completed ? 'var(--color-success)' : 'var(--color-text-subtle)', flexShrink: 0, marginTop: '2px' }}
              >
                {task.is_completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
            )}
            <p style={{
              flex: 1, minWidth: 0,
              fontWeight: 'var(--weight-semibold)',
              fontSize: 'var(--text-body)',
              color: task.is_completed ? 'var(--color-text-muted)' : 'var(--color-text-main)',
              textDecoration: task.is_completed ? 'line-through' : 'none',
              lineHeight: 1.45,
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}>
              {task.title}
            </p>
          </div>

          {/* Row 2: meta + actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingRight: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {dateLabel && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: 'var(--text-xs)',
                  color: isOverdue ? '#DC2626' : 'var(--color-text-muted)',
                  fontWeight: isOverdue ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                }}>
                  <Clock size={11} /> {dateLabel}
                </span>
              )}
              {task.is_urgent && !task.is_completed && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                  fontSize: 'var(--text-xs)', color: '#DC2626', fontWeight: 'var(--weight-semibold)',
                }}>
                  <Flame size={11} /> דחוף
                </span>
              )}
            </div>
            {/* Action Buttons — hidden in select mode */}
            {!selectMode && (
              <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                <button onClick={onToggleUrgent} style={{ ...smallIconBtn, color: task.is_urgent ? '#DC2626' : 'var(--color-text-subtle)' }} title="דחוף">
                  <Flame size={14} />
                </button>
                <button onClick={onEdit} style={{ ...smallIconBtn }} title="ערוך">
                  <Edit2 size={14} />
                </button>
                <button onClick={onDelete} style={{ ...smallIconBtn }} title="מחק">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Shared Styles ────────────────────────────────────────────────
const iconBtnStyle = {
  width: '34px', height: '34px', border: 'none',
  background: 'var(--color-surface-alt)',
  borderRadius: 'var(--radius-button)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'var(--color-text-muted)',
  transition: 'var(--transition-fast)',
  flexShrink: 0,
};

const inputStyle = {
  width: '100%', padding: '10px 12px',
  border: '1px solid var(--color-input-border)',
  borderRadius: 'var(--radius-button)',
  background: 'var(--color-input-bg)',
  color: 'var(--color-text-main)',
  fontSize: 'var(--text-body)',
  outline: 'none',
};

const primaryBtnStyle = {
  padding: '10px 16px', border: 'none',
  borderRadius: 'var(--radius-button)',
  background: 'var(--color-primary)',
  color: '#fff', fontWeight: 'var(--weight-semibold)',
  fontSize: 'var(--text-caption)', cursor: 'pointer',
};

const ghostBtnStyle = {
  padding: '10px 14px', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-button)',
  background: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
  fontWeight: 'var(--weight-medium)',
  fontSize: 'var(--text-caption)', cursor: 'pointer',
};

const smallIconBtn = {
  width: '28px', height: '28px', border: 'none',
  background: 'transparent',
  borderRadius: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'var(--color-text-subtle)',
  transition: 'background 0.12s ease, color 0.12s ease',
  flexShrink: 0,
};
