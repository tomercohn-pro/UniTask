import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Award, ArrowRight, Edit, Save, Plus, Trash2, X } from 'lucide-react';

const initialMockData = {
  'UI Design': {
    courseName: 'UI Design',
    gradeBreakdown: [
      { label: 'פרויקט גמר', value: '50%' },
      { label: 'מטלות שוטפות', value: '20%' },
      { label: 'מבחן מסכם', value: '30%' },
    ],
    weeklyTopics: [
      { week: 'שבוע 1', topic: 'מבוא לעיצוב ממשקי משתמש ומושגי UX' },
      { week: 'שבוע 2', topic: 'עקרונות טיפוגרפיה וצבע בממשק' },
      { week: 'שבוע 3', topic: 'פרוטוטייפינג והצגת סקיצות' },
      { week: 'שבוע 4', topic: 'גלישה רספונסיבית וחוויית משתמש' },
      { week: 'שבוע 5', topic: 'בחינת קונספט ועיצוב סופי' },
    ],
  },
  'React Essentials': {
    courseName: 'React Essentials',
    gradeBreakdown: [
      { label: 'פרויקט מודול React', value: '40%' },
      { label: 'מטלות תרגול', value: '25%' },
      { label: 'מבחן סופי', value: '35%' },
    ],
    weeklyTopics: [
      { week: 'שבוע 1', topic: 'מבוא ל-React ויצירת קומפוננטות' },
      { week: 'שבוע 2', topic: 'ניהול state ו-Props' },
      { week: 'שבוע 3', topic: 'React Hooks בסיסיים' },
      { week: 'שבוע 4', topic: 'כלים לעבודה עם API ו-fetch' },
      { week: 'שבוע 5', topic: 'ריענון פרויקט והכנה להצגה' },
    ],
  },
};

const emptyCourse = {
  courseName: '',
  gradeBreakdown: [{ label: 'פרויקט גמר', value: '50%' }],
  weeklyTopics: [{ week: 'שבוע 1', topic: '' }],
};

export default function SyllabusPage({ initialData = null, onDataChange = null }) {
  const navigate = useNavigate();
  const [syllabuses, setSyllabuses] = useState(() => initialData ?? initialMockData);
  const [selectedCourse, setSelectedCourse] = useState(Object.keys(initialMockData)[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editCourseData, setEditCourseData] = useState(initialMockData[selectedCourse]);
  const [newCourseData, setNewCourseData] = useState(emptyCourse);

  const courseKeys = Object.keys(syllabuses);
  const selectedKey = syllabuses[selectedCourse] ? selectedCourse : courseKeys[0];
  const course = syllabuses[selectedKey];

  useEffect(() => {
    if (typeof onDataChange === 'function') {
      onDataChange(syllabuses);
    }
  }, [syllabuses, onDataChange]);

  function normalizePercentValue(value) {
    return value.replace(/[^0-9]/g, '');
  }

  function updateGradeItem(index, field, value) {
    const next = [...editCourseData.gradeBreakdown];
    next[index] = { ...next[index], [field]: field === 'value' ? normalizePercentValue(value) : value };
    setEditCourseData({ ...editCourseData, gradeBreakdown: next });
  }

  function updateTopicItem(index, field, value) {
    const next = [...editCourseData.weeklyTopics];
    next[index] = { ...next[index], [field]: value };
    setEditCourseData({ ...editCourseData, weeklyTopics: next });
  }

  function addGradeRow() {
    setEditCourseData({
      ...editCourseData,
      gradeBreakdown: [...editCourseData.gradeBreakdown, { label: '', value: '' }],
    });
  }

  function addTopicRow() {
    setEditCourseData({
      ...editCourseData,
      weeklyTopics: [...editCourseData.weeklyTopics, { week: `שבוע ${editCourseData.weeklyTopics.length + 1}`, topic: '' }],
    });
  }

  function removeGradeRow(index) {
    setEditCourseData({
      ...editCourseData,
      gradeBreakdown: editCourseData.gradeBreakdown.filter((_, i) => i !== index),
    });
  }

  function removeTopicRow(index) {
    setEditCourseData({
      ...editCourseData,
      weeklyTopics: editCourseData.weeklyTopics.filter((_, i) => i !== index),
    });
  }

  function handleEditSave() {
    const normalized = editCourseData.courseName.trim() || selectedKey;
    const targetKey = normalized;
    const updated = { ...syllabuses };

    if (normalized !== selectedKey && updated[targetKey]) {
      const timestamp = Date.now();
      updated[`${targetKey} (${timestamp})`] = { ...editCourseData, courseName: targetKey };
      delete updated[selectedKey];
      setSelectedCourse(`${targetKey} (${timestamp})`);
    } else {
      delete updated[selectedKey];
      updated[targetKey] = { ...editCourseData, courseName: targetKey };
      setSelectedCourse(targetKey);
    }

    setSyllabuses(updated);
    setIsEditing(false);
  }

  function handleAddNew() {
    setIsAddingNew(true);
    setIsEditing(false);
    setNewCourseData(emptyCourse);
    setEditCourseData(emptyCourse);
  }

  function handleNewGradeChange(index, field, value) {
    const next = [...newCourseData.gradeBreakdown];
    next[index] = { ...next[index], [field]: field === 'value' ? normalizePercentValue(value) : value };
    setNewCourseData({ ...newCourseData, gradeBreakdown: next });
  }

  function handleNewTopicChange(index, field, value) {
    const next = [...newCourseData.weeklyTopics];
    next[index] = { ...next[index], [field]: value };
    setNewCourseData({ ...newCourseData, weeklyTopics: next });
  }

  function addNewGradeRow() {
    setNewCourseData({
      ...newCourseData,
      gradeBreakdown: [...newCourseData.gradeBreakdown, { label: '', value: '' }],
    });
  }

  function addNewTopicRow() {
    setNewCourseData({
      ...newCourseData,
      weeklyTopics: [...newCourseData.weeklyTopics, { week: `שבוע ${newCourseData.weeklyTopics.length + 1}`, topic: '' }],
    });
  }

  function removeNewGradeRow(index) {
    setNewCourseData({
      ...newCourseData,
      gradeBreakdown: newCourseData.gradeBreakdown.filter((_, i) => i !== index),
    });
  }

  function removeNewTopicRow(index) {
    setNewCourseData({
      ...newCourseData,
      weeklyTopics: newCourseData.weeklyTopics.filter((_, i) => i !== index),
    });
  }

  function handleSaveNewCourse() {
    const name = newCourseData.courseName.trim();
    if (!name) return;

    let targetKey = name;
    let attempt = 2;
    while (syllabuses[targetKey]) {
      targetKey = `${name} (${attempt})`;
      attempt += 1;
    }

    setSyllabuses({
      ...syllabuses,
      [targetKey]: { ...newCourseData, courseName: targetKey },
    });
    setSelectedCourse(targetKey);
    setIsAddingNew(false);
    setIsEditing(false);
    setEditCourseData({ ...newCourseData, courseName: targetKey });
  }

  return (
    <div dir="rtl" style={{ padding: 'var(--space-3)', paddingBottom: '100px', color: 'var(--color-text-main)' }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', cursor: 'pointer' }}
            >
              <ArrowRight size={18} />
              חזור
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-bold)' }}>סילבוס ופירוט קורסים</h1>
              <p style={{ margin: '8px 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-body)' }}>ניהול דינמי של סילבוס הקורסים, עדכון הציונים ותוכנית השיעורים.</p>
            </div>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: 'rgba(79, 70, 229, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <BookOpen size={24} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {courseKeys.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedCourse(name);
                  setIsEditing(false);
                  setIsAddingNew(false);
                  setEditCourseData(syllabuses[name]);
                }}
                style={{
                  minWidth: '180px',
                  borderRadius: '14px',
                  border: selectedKey === name ? '2px solid var(--color-primary)' : `1px solid var(--color-border)`,
                  backgroundColor: selectedKey === name ? 'rgba(79, 70, 229, 0.08)' : 'var(--color-surface)',
                  color: selectedKey === name ? 'var(--color-primary)' : 'var(--color-text-main)',
                  padding: '14px 18px',
                  fontWeight: selectedKey === name ? 'var(--weight-bold)' : 'var(--weight-medium)',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: 'var(--text-body)' }}>{name}</div>
                <div style={{ marginTop: '6px', color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)' }}>תוכנית סילבוס מלאה</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleAddNew}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '16px',
              padding: '14px 18px',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-surface)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'var(--weight-bold)',
            }}
          >
            <Plus size={18} />
            הוסף קורס חדש
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <section style={{ flex: '1 1 320px', minWidth: '320px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-bold)' }}>{isAddingNew ? 'פרטי הקורס החדש' : 'הרכב הציון בקורס'}</h2>
              <p style={{ margin: '10px 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)' }}>{isAddingNew ? 'הזן נתונים ראשוניים לקורס החדש.' : 'החלוקה בין המטלות, הפרויקט והמבחן.'}</p>
            </div>
            <Award size={24} color="var(--color-primary)" />
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-muted)' }}>שם הקורס</label>
              <input
                type="text"
                value={isAddingNew ? newCourseData.courseName : editCourseData.courseName}
                onChange={(e) => {
                  if (isAddingNew) {
                    setNewCourseData({ ...newCourseData, courseName: e.target.value });
                  } else {
                    setEditCourseData({ ...editCourseData, courseName: e.target.value });
                  }
                }}
                style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '14px' }}
                disabled={!isAddingNew && !isEditing}
              />
            </div>

            {(isAddingNew || isEditing) ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)' }}>הרכב ציונים</span>
                  <button
                    type="button"
                    onClick={isAddingNew ? addNewGradeRow : addGradeRow}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                    הוסף פריט
                  </button>
                </div>
                {(isAddingNew ? newCourseData.gradeBreakdown : editCourseData.gradeBreakdown).map((item, index) => (
                  <div key={`grade-${index}`} style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => isAddingNew ? handleNewGradeChange(index, 'label', e.target.value) : updateGradeItem(index, 'label', e.target.value)}
                        placeholder="שם הפריט"
                        style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '14px' }}
                      />
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={item.value.replace('%', '')}
                          onChange={(e) => isAddingNew ? handleNewGradeChange(index, 'value', e.target.value) : updateGradeItem(index, 'value', e.target.value)}
                          placeholder="אחוז"
                          style={{ width: '80px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '14px' }}
                        />
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => isAddingNew ? removeNewGradeRow(index) : removeGradeRow(index)}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.16)', color: 'var(--color-primary)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {course.gradeBreakdown.map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '14px', backgroundColor: 'var(--color-bg)', border: `1px solid var(--color-border)` }}>
                    <span style={{ color: 'var(--color-text-main)', fontWeight: 'var(--weight-bold)' }}>{item.label}</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--weight-bold)' }}>{item.value.replace('%', '')}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isAddingNew && !isEditing && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '14px', padding: '14px 18px', backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', border: 'none', cursor: 'pointer', fontWeight: 'var(--weight-bold)' }}
              >
                <Edit size={18} />
                ערוך קורס
              </button>
            </div>
          )}

          {(isAddingNew || isEditing) && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={isAddingNew ? handleSaveNewCourse : handleEditSave}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '14px', padding: '14px 18px', backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', border: 'none', cursor: 'pointer', fontWeight: 'var(--weight-bold)' }}
              >
                <Save size={18} />
                {isAddingNew ? 'שמור קורס חדש' : 'שמור שינויים'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isAddingNew) setIsAddingNew(false);
                  if (isEditing) setIsEditing(false);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '14px', padding: '14px 18px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', border: `1px solid var(--color-border)`, cursor: 'pointer' }}
              >
                <X size={18} />
                ביטול
              </button>
            </div>
          )}
        </section>

        <section style={{ flex: '2 1 560px', minWidth: '320px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-h2)', fontWeight: 'var(--weight-bold)' }}>{isAddingNew ? 'תוכנית לימודים ראשונית' : 'תוכנית הלימודים השבועית'}</h2>
              <p style={{ margin: '10px 0 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)' }}>{isAddingNew ? 'הוסף נושאי שבוע וקו זמן לקורס החדש.' : 'מה ילמדו בכל שבוע בקורס הנבחר.'}</p>
            </div>
            <Calendar size={24} color="var(--color-primary)" />
          </div>

          {(isAddingNew || isEditing) ? (
            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)' }}>נושאים שבועיים</span>
                <button
                  type="button"
                  onClick={isAddingNew ? addNewTopicRow : addTopicRow}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                >
                  <Plus size={16} />
                  הוסף שבוע
                </button>
              </div>

              {(isAddingNew ? newCourseData.weeklyTopics : editCourseData.weeklyTopics).map((item, index) => (
                <div key={`topic-${index}`} style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={item.week}
                      onChange={(e) => isAddingNew ? handleNewTopicChange(index, 'week', e.target.value) : updateTopicItem(index, 'week', e.target.value)}
                      placeholder="שם השבוע"
                      style={{ flex: '0 0 140px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      value={item.topic}
                      onChange={(e) => isAddingNew ? handleNewTopicChange(index, 'topic', e.target.value) : updateTopicItem(index, 'topic', e.target.value)}
                      placeholder="נושא השבוע"
                      style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 14px', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '14px' }}
                    />
                    <button
                      type="button"
                      onClick={() => isAddingNew ? removeNewTopicRow(index) : removeTopicRow(index)}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.16)', color: 'var(--color-primary)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {course.weeklyTopics.map((item) => (
                <div key={item.week} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '14px', alignItems: 'center', padding: '16px', borderRadius: '14px', backgroundColor: 'var(--color-bg)', border: `1px solid var(--color-border)` }}>
                  <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>{item.week}</div>
                  <div style={{ color: 'var(--color-text-main)' }}>{item.topic}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
