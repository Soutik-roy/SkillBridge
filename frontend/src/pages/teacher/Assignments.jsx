import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader2, Plus, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    total_points: 100
  });

  const fetchAssignments = async () => {
    try {
      const res = await client.get('/faculty/assignments');
      // Handle backwards compatibility if it returns array directly
      if (Array.isArray(res.data)) {
         setAssignments(res.data);
         setTotalStudents(0);
      } else {
         setAssignments(res.data.assignments);
         setTotalStudents(res.data.total_students);
      }
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await client.post('/faculty/assignments', formData);
      toast.success('Assignment created successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', description: '', due_date: '', total_points: 100 });
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverdue = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments & Grading</h1>
          <p className="text-gray-500">Create assignments, set deadlines, and track student submissions.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : assignments.length === 0 ? (
        <Card className="text-center py-16 bg-gray-50 border-dashed border-2">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Assignments Created</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2 mb-6">
              You haven't assigned any tasks to your students yet. Create one to get started tracking their progress.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="flex flex-col h-full">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className={
                    isOverdue(assignment.due_date) ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }>
                    {isOverdue(assignment.due_date) ? 'Overdue' : 'Active'}
                  </Badge>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <CardDescription className="text-indigo-600 font-medium">
                  {assignment.total_points} Points
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-4 flex flex-col justify-between">
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {assignment.description || "No description provided."}
                </p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Submitted</span>
                    <span className="font-semibold text-gray-900">0 / {totalStudents}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `0%` }}></div>
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    View Submissions & Grade
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Create New Assignment</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. React Components Lab" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Instructions</label>
                <textarea rows="4" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed instructions for the students..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input required type="date" className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Points</label>
                  <input required type="number" min="1" max="1000" className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" value={formData.total_points} onChange={e => setFormData({...formData, total_points: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3 border-t mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
