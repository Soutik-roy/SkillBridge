import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Plus, Loader2, Link as LinkIcon, Users, Building2 } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_audience: 'STUDENT',
    url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await client.get('/jobs/recruiter/programs');
      setPrograms(res.data);
    } catch (err) {
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  const handlePostProgram = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post('/jobs/programs', formData);
      toast.success("Industry Learning Program posted successfully!");
      setShowForm(false);
      setFormData({ title: '', description: '', target_audience: 'STUDENT', url: '' });
      fetchPrograms();
    } catch (err) {
      toast.error("Failed to post program");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Industry Learning Programs</h1>
          <p className="text-gray-500 mt-1">Create training and upskilling programs for students and faculty.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Create Program</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-indigo-100 shadow-md">
          <CardHeader className="bg-indigo-50/50 border-b">
            <CardTitle>Post a New Program</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handlePostProgram} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Cloud Computing Masterclass"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the curriculum, outcomes, and schedule..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    value={formData.target_audience}
                    onChange={e => setFormData({...formData, target_audience: e.target.value})}
                  >
                    <option value="STUDENT">Students Only</option>
                    <option value="TEACHER">Faculty / Teachers Only</option>
                    <option value="BOTH">Both Students & Teachers</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration URL (Optional)</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={e => setFormData({...formData, url: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Publish Program
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {programs.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Programs Yet</h3>
          <p className="text-gray-500">Post your first industry learning program to help academia bridge the gap.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {programs.map(program => (
            <Card key={program.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                    <p className="text-gray-600 mt-2 whitespace-pre-line">{program.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        <Users className="w-3 h-3 mr-1" /> 
                        {program.target_audience === 'BOTH' ? 'Students & Teachers' : program.target_audience === 'STUDENT' ? 'Students' : 'Faculty'}
                      </Badge>
                      
                      {program.url && (
                        <a href={program.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                          <LinkIcon className="w-3 h-3 mr-1" /> View Registration Page
                        </a>
                      )}
                    </div>
                  </div>
                  <Badge variant={program.is_active ? 'default' : 'secondary'} className={program.is_active ? 'bg-green-100 text-green-800 border-none' : ''}>
                    {program.is_active ? 'Active' : 'Closed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
