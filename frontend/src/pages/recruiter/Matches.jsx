import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, Loader2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterMatches() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await client.get('/jobs/recruiter/me');
      setJobs(res.data);
      if (res.data.length > 0) {
        setSelectedJob(res.data[0].id);
      }
    } catch (err) {
      toast.error("Failed to load your jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchCandidates = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      const res = await client.get(`/engine/match-candidates/${selectedJob}?top_n=10`);
      setCandidates(res.data);
    } catch (err) {
      toast.error("Failed to find matching candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJob) {
      fetchCandidates();
    }
  }, [selectedJob]);

  if (loadingJobs) {
    return <div className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Candidate Matching</h1>
        <p className="text-gray-500 mt-1">Our intelligence engine scans all students to find the perfect match for your job requirements.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select a Job Posting</label>
          <select 
            className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            {jobs.length === 0 && <option value="">No active jobs</option>}
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
        <Button onClick={fetchCandidates} disabled={loading || !selectedJob} className="whitespace-nowrap">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Find Matches
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
           {[1,2,3].map(i => <Card key={i} className="h-40 animate-pulse bg-gray-50" />)}
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Candidates Found</h3>
          <p className="text-gray-500">Try lowering the required skills or post a new job.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate, idx) => (
            <Card key={candidate.student_id} className={`overflow-hidden transition-all ${idx === 0 ? 'ring-2 ring-indigo-500 shadow-md' : 'hover:shadow-md'}`}>
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{candidate.ai_skill_summary}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Matched Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {candidate.matched_skills.length > 0 ? (
                          candidate.matched_skills.map((skill, sIdx) => (
                            <Badge key={sIdx} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Missing Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {candidate.missing_skills.length > 0 ? (
                          candidate.missing_skills.map((skill, sIdx) => (
                            <Badge key={sIdx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" /> {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 md:w-56 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="mb-4">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset={226 - (226 * candidate.match_score) / 100} className={candidate.match_score > 70 ? 'text-green-500' : candidate.match_score > 40 ? 'text-yellow-500' : 'text-red-500'} />
                      </svg>
                      <span className="absolute text-xl font-bold">{Math.round(candidate.match_score)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-2">AI MATCH SCORE</p>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => toast.success('Invite sent!')}>
                    Invite to Apply
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
