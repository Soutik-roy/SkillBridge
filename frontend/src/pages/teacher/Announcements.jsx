import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader2, Plus, Megaphone, Trash2, Edit } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function TeacherAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const fetchAnnouncements = async () => {
    try {
      const res = await client.get('/faculty/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await client.post('/faculty/announcements', formData);
      toast.success('Announcement broadcasted!');
      setShowCreateModal(false);
      setFormData({ title: '', content: '' });
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to post announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500">Broadcast updates and notices to all your assigned students.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : announcements.length === 0 ? (
        <Card className="text-center py-16 bg-gray-50 border-dashed border-2">
          <CardContent>
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Announcements Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2 mb-6">
              You haven't posted any announcements. Keep your students updated on classes, exams, and opportunities.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create First Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id} className="overflow-hidden">
              <div className="bg-indigo-50 px-6 py-3 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-900">
                    {new Date(ann.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-500 hover:text-indigo-600"><Edit className="h-4 w-4" /></button>
                  <button className="text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{ann.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
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
              <h3 className="text-lg font-bold text-gray-900">Post Announcement</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Title</label>
                <input required type="text" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. End Semester Project Guidelines" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                <textarea required rows="5" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Write your announcement here..." />
              </div>
              <div className="pt-2 flex justify-end gap-3 border-t mt-6">
                <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Broadcast'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
