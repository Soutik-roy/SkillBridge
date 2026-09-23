import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Building, MapPin, Sparkles } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const [jobsRes, internsRes, appliedRes] = await Promise.all([
        client.post('/engine/match-jobs', { student_skills: [], top_n: 10 }),
        client.post('/engine/match-internships', { student_skills: [], top_n: 10 }),
        client.get('/students/applications')
      ]);
      setJobs(jobsRes.data);
      setInternships(internsRes.data);
      setAppliedJobs(new Set(appliedRes.data));
    } catch (error) {
      toast.error("Failed to load matching jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      await client.post(`/jobs/${id}/apply`);
      toast.success("Application submitted successfully!");
      setAppliedJobs(prev => new Set([...prev, id]));
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("You have already applied to this job");
      } else {
        toast.error("Failed to submit application");
      }
    }
  };

  const dataToRender = activeTab === 'jobs' ? jobs : internships;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Job Match</h1>
          <p className="text-gray-500 mt-1">Opportunities ranked by how well they match your verified skills.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'jobs' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('jobs')}
          >
            Full-time Jobs
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'internships' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('internships')}
          >
            Internships
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Card key={i} className="h-32 animate-pulse bg-gray-100" />)}
        </div>
      ) : dataToRender.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
          <p className="text-gray-500">Update your skill profile to see more opportunities.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {dataToRender.map((item, idx) => (
            <Card key={idx} className={`overflow-hidden ${idx === 0 ? 'border-indigo-300 shadow-md ring-1 ring-indigo-100' : ''}`}>
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                        <span className="flex items-center"><Building className="w-4 h-4 mr-1"/> {item.company}</span>
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {item.is_remote ? 'Remote' : 'On-site'}</span>
                        {item.stipend_monthly && <span>₹{item.stipend_monthly.toLocaleString()}/mo</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">
                        {item.match_score}% Match
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {idx === 0 && item.ai_explanation && (
                    <div className="mt-4 p-3 bg-indigo-50/50 rounded-md border border-indigo-100 text-sm flex gap-3 items-start">
                      <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <span className="text-indigo-900 leading-relaxed">{item.ai_explanation}</span>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase flex items-center mr-2">Skills:</span>
                    {item.matched_skills?.map(s => (
                      <Badge key={`m-${s}`} variant="success" className="capitalize">{s} (Match)</Badge>
                    ))}
                    {item.missing_skills?.map(s => (
                      <Badge key={`mis-${s}`} variant="outline" className="capitalize text-gray-400">{s} (Missing)</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 md:w-48 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center items-center text-center">
                  {appliedJobs.has(item.job_id || item.internship_id) ? (
                    <Button className="w-full mb-3" disabled variant="secondary">
                      Applied ✓
                    </Button>
                  ) : (
                    <Button className="w-full mb-3" onClick={() => handleApply(item.job_id || item.internship_id)}>
                      Apply Now
                    </Button>
                  )}
                  <span className="text-xs text-gray-500">via SkillBridge</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
