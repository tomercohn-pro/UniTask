import { useEffect, useState } from 'react';
import SyllabusPage from './SyllabusPage';

const STORAGE_KEY = 'savedCoursesData';

function loadSavedCourses() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to load saved courses data:', error);
    return null;
  }
}

export default function CoursesPage() {
  const [savedCoursesData, setSavedCoursesData] = useState(() => loadSavedCourses());

  useEffect(() => {
    if (savedCoursesData === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCoursesData));
    } catch (error) {
      console.error('Failed to save courses data:', error);
    }
  }, [savedCoursesData]);

  return <SyllabusPage initialData={savedCoursesData} onDataChange={setSavedCoursesData} />;
}
