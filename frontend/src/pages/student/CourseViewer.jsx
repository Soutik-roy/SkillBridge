import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { Badge } from '../../components/ui/Badge';
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  BookOpen, Clock, Trophy, Menu, X
} from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

// Minimal markdown renderer for lesson content
function LessonContent({ content }) {
  const renderLine = (line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-gray-700">{line.slice(2)}</li>;
    if (line.startsWith('**Practice:**')) return <div key={i} className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"><span className="font-bold text-indigo-800">Practice: </span><span className="text-indigo-700">{line.slice(13)}</span></div>;
    if (line.startsWith('🎉')) return <div key={i} className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 font-bold text-center text-lg">{line}</div>;
    if (line.startsWith('|')) return null; // skip table lines (handled below)
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="text-gray-700 leading-relaxed">{line}</p>;
  };

  // Handle code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-1">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre key={i} className="bg-gray-900 text-green-300 rounded-xl p-4 text-sm overflow-x-auto my-4 leading-relaxed">
              <code>{code}</code>
            </pre>
          );
        }
        return part.split('\n').map(renderLine);
      })}
    </div>
  );
}

export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completed_lesson_ids: [], completion_pct: 0 });
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course first — never block on progress failure
    client.get(`/courses/${courseId}`)
      .then(r => setCourse(r.data))
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));

    // Fetch progress independently — non-fatal if it fails
    client.get(`/courses/${courseId}/progress`)
      .then(r => setProgress(r.data))
      .catch(() => {
        // Student profile may not be linked yet — use default empty progress
        setProgress({ completed_lesson_ids: [], completed_count: 0, completion_pct: 0, total_lessons: 0 });
      });
  }, [courseId]);

  const currentLesson = course?.lessons?.[currentLessonIdx];
  const isCompleted = (lessonId) => progress.completed_lesson_ids?.includes(lessonId);

  const handleComplete = async () => {
    if (!currentLesson || isCompleted(currentLesson.id)) return;
    setCompleting(true);
    try {
      await client.post(`/courses/${courseId}/lessons/${currentLesson.id}/complete`);
      setProgress(p => ({
        ...p,
        completed_lesson_ids: [...(p.completed_lesson_ids || []), currentLesson.id],
        completed_count: (p.completed_count || 0) + 1,
        completion_pct: Math.round(((p.completed_count || 0) + 1) / course.lessons.length * 100)
      }));
      toast.success('Lesson complete! 🎉');
      // Auto-advance
      if (currentLessonIdx < course.lessons.length - 1) {
        setTimeout(() => setCurrentLessonIdx(i => i + 1), 600);
      }
    } catch {
      toast.error('Failed to mark as complete');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );
  if (!course) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Course not found.</p>
      <Button onClick={() => navigate('/courses')} className="mt-4">← Back to Courses</Button>
    </div>
  );

  const totalLessons = course.lessons.length;
  const completedCount = progress.completed_lesson_ids?.length || 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden bg-gray-900 flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white text-xs flex items-center gap-1 mb-3">
            <ChevronLeft className="w-3 h-3" /> All Courses
          </button>
          <h2 className="text-white font-bold text-sm leading-snug">{course.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{completedCount}/{totalLessons} lessons</span>
              <span>{progress.completion_pct}%</span>
            </div>
            <Progress value={progress.completion_pct} className="h-1.5 bg-gray-700" indicatorClassName="bg-indigo-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {course.lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setCurrentLessonIdx(idx)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                idx === currentLessonIdx
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isCompleted(lesson.id)
                  ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                  : <Circle className="w-4 h-4 text-gray-500" />
                }
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium leading-snug truncate">{lesson.title}</p>
                <p className={`text-xs mt-0.5 ${idx === currentLessonIdx ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {lesson.duration_mins} min
                </p>
              </div>
            </button>
          ))}

          {progress.completion_pct === 100 && (
            <div className="m-4 p-3 bg-green-900/50 rounded-xl text-center">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-green-300 text-xs font-bold">Course Complete!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-400 hover:text-gray-700">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <p className="text-xs text-gray-400">Lesson {currentLessonIdx + 1} of {totalLessons}</p>
              <h1 className="text-base font-bold text-gray-900">{currentLesson?.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {currentLesson?.duration_mins} min read
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
          {currentLesson && <LessonContent content={currentLesson.content} />}
        </div>

        {/* Bottom Navigation */}
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentLessonIdx(i => Math.max(0, i - 1))}
            disabled={currentLessonIdx === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-3">
            {isCompleted(currentLesson?.id) ? (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </Badge>
            ) : (
              <Button onClick={handleComplete} isLoading={completing} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentLessonIdx(i => Math.min(totalLessons - 1, i + 1))}
            disabled={currentLessonIdx === totalLessons - 1}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
