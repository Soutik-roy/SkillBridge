import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader2, Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    skill_name: '',
    level: 'Beginner',
    duration_weeks: 4,
    is_free: true
  });

  const fetchCourses = async () => {
    try {
      const res = await client.get('/faculty/courses');
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await client.post('/faculty/courses', formData);
      toast.success('Course created successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', skill_name: '', level: 'Beginner', duration_weeks: 4, is_free: true });
      fetchCourses();
    } catch (err) {
      toast.error('Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500">Manage the courses and modules you teach on SkillBridge.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className={
                    course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }>
                    {course.level}
                  </Badge>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {course.duration_weeks} Weeks
                  </span>
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>Target Skill: {course.skill_name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end pt-0">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4 border-t pt-4 mt-2">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course.enrolled_count || 0} Enrolled</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{course.is_free ? 'Free' : 'Paid'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 h-9">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Create New Course</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Advanced Database Design" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Skill</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.skill_name} onChange={e => setFormData({...formData, skill_name: e.target.value})} placeholder="e.g. SQL" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm bg-white" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Weeks)</label>
                  <input required type="number" min="1" max="52" className="w-full border rounded-md px-3 py-2 text-sm" value={formData.duration_weeks} onChange={e => setFormData({...formData, duration_weeks: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3 border-t mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
