import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mammoth from 'mammoth';
import { ArrowRight, FileText, Sparkles, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient.js'; // ודא שהנתיב נכון

export default function ScannerPage() {
  const navigate = useNavigate();
  
  // ניהול מצבי המערכת
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null); // 'found', 'not_found', null
  const [extractedTask, setExtractedTask] = useState({ title: '', due_date: '' });
  const [isSaved, setIsSaved] = useState(false);

  // 1. כשבוחרים קובץ אמיתי מהמחשב/טלפון
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setScanResult(null);
      setIsSaved(false);
      setProgress(0);
    }
  };

  // 2. כפתור הסריקה מפעיל את האנימציה ואז את הקריאה
  const handleStartScan = () => {
    if (!file || isScanning) return;
    
    setIsScanning(true);
    setScanResult(null);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        readAndAnalyzeFile(); // כשהגיע ל-100%, קורא את הקובץ
      }
    }, 400);
  };

  const analyzeText = (text) => {
    const hasTaskKeyword = text.includes('מטלה') || text.includes('תרגיל') || text.includes('פרויקט');
    const hasSubmissionKeyword = text.includes('להגיש') || text.includes('הגשה') || text.includes('תאריך');

    if (hasTaskKeyword && hasSubmissionKeyword) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const fileNameWithoutExtension = file?.name.replace(/\.(txt|docx)$/i, '');

      setExtractedTask({
        title: `מטלה מתוך: ${fileNameWithoutExtension}`,
        due_date: nextWeek.toISOString().split('T')[0]
      });
      setScanResult('found');
    } else {
      setScanResult('not_found');
    }
    setIsScanning(false);
  };

  // 3. קריאת הקובץ והפעלת ה"בינה מלאכותית"
  const readAndAnalyzeFile = () => {
    if (!file) return;

    const reader = new FileReader();
    const isDocx = file.name.toLowerCase().endsWith('.docx');

    if (isDocx) {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const { value } = await mammoth.extractRawText({ arrayBuffer });
          analyzeText(value);
        } catch (error) {
          console.error('שגיאה בקריאת קובץ DOCX:', error);
          setScanResult('not_found');
          setIsScanning(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (e) => {
        analyzeText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  // 4. שמירה לדאטה-בייס
  const handleSaveTask = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const { error } = await supabase
      .from('tasks')
      .insert([{
        title: extractedTask.title,
        due_date: extractedTask.due_date,
        is_urgent: false,
        is_completed: false,
        user_id: userId,
      }]);

    if (error) {
      console.error('שגיאה בשמירת המטלה מהסורק:', error);
    } else {
      setIsSaved(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '140px', dir: 'rtl' }}>
      
      {/* Top Navigation - ניווט עליון */}
      <div style={{ 
        display: 'flex', alignItems: 'center', padding: 'var(--space-3)', 
        backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'var(--color-bg)', border: 'none', cursor: 'pointer', 
            width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <ArrowRight size={20} color="var(--color-text-main)" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 'var(--weight-bold)', margin: 0, paddingRight: '40px' }}>
          סריקת סילבוס
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* אייקון רובוט/קסם והסבר */}
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          marginBottom: 'var(--space-2)', marginTop: 'var(--space-2)'
        }}>
          <Sparkles size={36} color="var(--color-primary)" />
        </div>
        <h2 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--weight-bold)', marginBottom: '8px', textAlign: 'center' }}>
          ה-AI שלנו קורא בשבילך
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-caption)', marginBottom: 'var(--space-4)', lineHeight: '1.5' }}>
          העלה קובץ טקסט (txt) ואנחנו נחלץ ממנו אוטומטית מטלות ותאריכי הגשה.
        </p>

        {/* Dropzone - אזור העלאת הקובץ האמיתי */}
        <input 
          type="file" 
          accept=".txt,.docx" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
          id="real-file-upload" 
        />
        <label
          htmlFor="real-file-upload"
          style={{
            width: '100%', border: `2px dashed var(--color-secondary)`, borderRadius: 'var(--radius-card)',
            backgroundColor: file ? 'rgba(16, 185, 129, 0.08)' : 'rgba(79, 70, 229, 0.08)', 
            borderColor: file ? 'var(--color-success)' : 'var(--color-secondary)',
            padding: 'var(--space-4)', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            cursor: isScanning ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: 'var(--space-4)'
          }}
        >
          <UploadCloud size={48} color={file ? "var(--color-success)" : "var(--color-secondary)"} style={{ marginBottom: 'var(--space-2)', opacity: 0.8 }} />
          <div style={{ 
            backgroundColor: 'var(--color-surface)', color: file ? "var(--color-success)" : "var(--color-primary)", 
            border: `1px solid ${file ? "var(--color-success)" : "var(--color-border)"}`, borderRadius: 'var(--radius-button)', 
            padding: '8px 20px', fontWeight: 'var(--weight-bold)', fontSize: '14px',
            marginBottom: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            {file ? 'החלף קובץ' : 'בחר קובץ txt מהמכשיר'}
          </div>
          <span style={{ fontSize: '14px', color: 'var(--color-text-main)', fontWeight: 'var(--weight-bold)' }}>
            {file ? file.name : 'לא נבחר קובץ'}
          </span>
        </label>

        {/* Progress Card - אנימציית הטעינה שלך */}
        {isScanning && (
          <div style={{ 
            width: '100%', padding: 'var(--space-3)', 
            backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', 
            boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-bg)', marginBottom: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: '14px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-main)' }}>{file?.name}</span>
              </div>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'var(--weight-bold)', fontSize: '14px' }}>{progress}%</span>
            </div>
            
            <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-bg)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', 
                borderRadius: '10px', transition: 'width 0.4s ease-out' 
              }}></div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 'var(--weight-medium)' }}>
              מנתח תאריכים בעזרת בינה מלאכותית...
            </div>
          </div>
        )}

        {/* תוצאות הסריקה - לא נמצא */}
        {scanResult === 'not_found' && (
          <div style={{ width: '100%', backgroundColor: 'var(--color-error-bg)', border: '1px solid var(--color-error-border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-3)', display: 'flex', gap: '12px' }}>
            <AlertCircle color="var(--color-error)" size={24} style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: 0, color: 'var(--color-error)', fontSize: '16px', fontWeight: 'bold' }}>לא נמצאו מטלות</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--color-error)', fontSize: '14px' }}>
                הסורק לא זיהה מטלות או תאריכי הגשה במסמך הזה. אפשר לנוח!
              </p>
            </div>
          </div>
        )}

        {/* תוצאות הסריקה - נמצאה מטלה */}
        {scanResult === 'found' && !isSaved && (
          <div style={{ width: '100%', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CheckCircle color="var(--color-success)" size={24} />
              <h3 style={{ margin: 0, color: 'var(--color-success)', fontSize: '16px', fontWeight: 'bold' }}>זיהינו מטלה!</h3>
            </div>
            
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>שם המטלה:</label>
                <input 
                  type="text" 
                  value={extractedTask.title} 
                  onChange={(e) => setExtractedTask({...extractedTask, title: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>תאריך הגשה:</label>
                <input 
                  type="date" 
                  value={extractedTask.due_date} 
                  onChange={(e) => setExtractedTask({...extractedTask, due_date: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button 
              onClick={handleSaveTask}
              style={{ width: '100%', padding: '12px', backgroundColor: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <CheckCircle size={18} />
              שמור מטלה לדשבורד
            </button>
          </div>
        )}

        {/* הודעת הצלחה לאחר השמירה */}
        {isSaved && (
          <div style={{ width: '100%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'var(--color-success-bg)', borderRadius: '50%', color: 'var(--color-success)', marginBottom: '12px' }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>נשמר בהצלחה!</h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', fontSize: '14px' }}>
              המטלה מחכה לך עכשיו בדשבורד הראשי.
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA - מופיע רק אם יש קובץ ועוד לא התחלנו לסרוק */}
      {!scanResult && !isScanning && (
        <div style={{ 
          padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', 
          borderTop: '1px solid var(--color-border)',
          position: 'fixed', bottom: '80px', width: '100%', maxWidth: '600px', alignSelf: 'center'
        }}>
           <button 
            onClick={handleStartScan}
            disabled={!file}
            style={{ 
             width: '100%', height: '56px', backgroundColor: 'var(--color-primary)', 
             color: 'var(--color-surface)', border: 'none', borderRadius: 'var(--radius-button)', 
             fontSize: 'var(--text-body)', fontWeight: 'var(--weight-bold)', 
             display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', 
             opacity: file ? 1 : 0.5, cursor: file ? 'pointer' : 'not-allowed',
             boxShadow: file ? '0px 4px 10px rgba(79, 70, 229, 0.25)' : 'none',
             transition: 'all 0.2s ease'
           }}>
             סרוק קובץ עכשיו <Sparkles size={18} />
           </button>
        </div>
      )}
    </div>
  );
}