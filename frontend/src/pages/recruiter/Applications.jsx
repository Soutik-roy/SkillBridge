import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { Loader2, FileText, CheckCircle, XCircle, Calendar, RefreshCcw } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await client.get('/jobs/recruiter/applications');
      setApplications(res.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await client.put(`/jobs/applications/${appId}/status?status=${newStatus}`);
      toast.success(`Application moved to ${newStatus}`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'APPLIED': return 'secondary';
      case 'REVIEWING': return 'warning';
      case 'SHORTLISTED': return 'primary';
      case 'INTERVIEW': return 'success';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Applications Manager</h1>
          <p className="text-gray-500 mt-1">Review, shortlist, and schedule interviews for your candidates.</p>
        </div>
        <Button onClick={fetchApplications} variant="outline">
          <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            Candidates will appear here once they apply to your active job postings.
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied For</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {app.candidate_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{app.candidate_name}</div>
                        <div className="text-xs text-gray-500">Match Score: {Math.round(app.ai_match_score || 0)}%</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{app.job_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(app.applied_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(app.status)}>{app.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {updating === app.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600 inline-block mr-4" />
                    ) : (
                      <div className="flex justify-end gap-2">
                        {app.status === 'APPLIED' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')} className="bg-indigo-600 hover:bg-indigo-700">
                            Shortlist
                          </Button>
                        )}
                        {app.status === 'SHORTLISTED' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')} className="bg-green-600 hover:bg-green-700 text-white">
                            <Calendar className="w-4 h-4 mr-1" /> Schedule Interview
                          </Button>
                        )}
                        {(app.status === 'APPLIED' || app.status === 'SHORTLISTED') && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                            Reject
                          </Button>
                        )}
                        {app.status === 'INTERVIEW' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" /> Hire
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
