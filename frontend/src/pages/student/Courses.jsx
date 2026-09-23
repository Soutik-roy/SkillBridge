import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { BookOpen, Clock, Star, ChevronRight, Sparkles } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

const SKILL_EMOJI = {
  python: '🐍', javascript: '⚡', sql: '🗄️', react: '⚛️',
  'machine learning': '🤖', docker: '🐳', aws: '☁️', fastapi: '🚀',
};

const LEVEL_COLOR = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-purple-100 text-purple-800',
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/courses')
      .then(r => setCourses(r.data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Learning Hub</h1>
        <p className="text-gray-500 mt-1">All courses are hosted on SkillBridge. No external redirects.</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Card key={i} className="h-48 animate-pulse bg-gray-100" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No courses available yet</h3>
          <p className="text-gray-500 text-sm mt-1">Run <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">python seed_lessons.py</code> in the backend to load courses.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card className="h-full hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{SKILL_EMOJI[course.skill_name] || '📘'}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${LEVEL_COLOR[course.level] || 'bg-gray-100 text-gray-700'}`}>
                      {course.level}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug group-hover:text-indigo-700 transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {course.lesson_count} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration_weeks}w
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {course.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={course.is_free ? 'success' : 'outline'} className="text-xs">
                      {course.is_free ? '✓ Free' : 'Paid'}
                    </Badge>
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Learning <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
