import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Users, Plus, X, Loader2 } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', required_skills: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await client.get('/jobs/recruiter/me');
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: newJob.title,
        description: newJob.description,
        required_skills: newJob.required_skills 
          ? newJob.required_skills.split(',').map(s => s.trim()).filter(Boolean) 
          : []
      };
      await client.post('/jobs', payload);
      toast.success("Job posted successfully!");
      setIsModalOpen(false);
      setNewJob({ title: '', description: '', required_skills: '' });
      fetchJobs();
    } catch (err) {
      toast.error("Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      await client.put(`/jobs/${jobId}?is_active=${!currentStatus}`);
      toast.success(`Job marked as ${!currentStatus ? 'Active' : 'Closed'}`);
      fetchJobs();
    } catch (err) {
      toast.error("Failed to update job status");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Postings</h1>
          <p className="text-gray-500 mt-1">Create and manage your job and internship postings.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
           {[1,2,3,4].map(i => <Card key={i} className="h-32 animate-pulse bg-gray-100" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No active jobs</h3>
          <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
          <Button onClick={() => setIsModalOpen(true)}>Create your first job</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map(job => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{job.title}</CardTitle>
                  <Badge variant={job.is_active ? "success" : "secondary"}>
                    {job.is_active ? 'Active' : 'Closed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>
                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {job.required_skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 border-t pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="font-medium text-gray-900 mr-1">Manage</span> Applicants
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button 
                      variant={job.is_active ? "outline" : "default"} 
                      size="sm"
                      onClick={() => toggleJobStatus(job.id, job.is_active)}
                    >
                      {job.is_active ? 'Close Job' : 'Reopen Job'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Post New Job</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Senior Frontend Developer"
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  value={newJob.description}
                  onChange={e => setNewJob({...newJob, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Python, React, SQL"
                  value={newJob.required_skills}
                  onChange={e => setNewJob({...newJob, required_skills: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Our AI Engine will use these exact skills to match you with top candidates.</p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Post Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
