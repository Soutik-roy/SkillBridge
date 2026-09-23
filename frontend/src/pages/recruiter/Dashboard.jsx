import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Briefcase, 
  FileText, 
  UserCheck, 
  Calendar,
  Plus,
  Loader2,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await client.get('/jobs/dashboard-metrics');
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your hiring and placement activities.</p>
        </div>
        <Link to="/recruiter/jobs">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <h3 className="text-3xl font-bold mt-1">{data?.active_jobs || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Applications</p>
              <h3 className="text-3xl font-bold mt-1">{data?.applications || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Shortlisted</p>
              <h3 className="text-3xl font-bold mt-1">{data?.shortlisted || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
              <UserCheck className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Interviews</p>
              <h3 className="text-3xl font-bold mt-1">{data?.interviews || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center border border-indigo-100">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Recent Applications) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <Link to="/recruiter/applications" className="text-sm font-semibold text-indigo-600 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-white border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">CANDIDATE</th>
                    <th className="px-4 py-3 font-semibold">POSITION</th>
                    <th className="px-4 py-3 font-semibold">APPLIED</th>
                    <th className="px-4 py-3 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.recent_applications?.length > 0 ? (
                    data.recent_applications.map((app, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium text-gray-900">{app.candidate_name}</td>
                        <td className="px-4 py-4 text-gray-600">{app.position}</td>
                        <td className="px-4 py-4 text-gray-600">
                          {new Date(app.applied_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            app.status === 'SHORTLISTED' ? 'bg-blue-50 text-blue-700' :
                            app.status === 'INTERVIEW' ? 'bg-green-50 text-green-700' :
                            app.status === 'REVIEWING' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500 italic">
                        No recent applications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Recruiter Tools */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recruiter Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/recruiter/jobs" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Briefcase className="h-6 w-6 text-gray-700 mb-2" />
                  <span className="text-sm font-semibold text-gray-900">Jobs</span>
                </Link>
                <Link to="/recruiter/applications" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <FileText className="h-6 w-6 text-gray-700 mb-2" />
                  <span className="text-sm font-semibold text-gray-900">Applications</span>
                </Link>
                <Link to="/recruiter/matching" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Users className="h-6 w-6 text-gray-700 mb-2" />
                  <span className="text-sm font-semibold text-gray-900">Candidates</span>
                </Link>
                <Link to="/recruiter/interviews" className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  <Calendar className="h-6 w-6 text-gray-700 mb-2" />
                  <span className="text-sm font-semibold text-gray-900">Interviews</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.upcoming_interviews?.length > 0 ? (
                data.upcoming_interviews.map((interview, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 rounded flex items-center justify-center border border-indigo-100 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{interview.candidate_name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{interview.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No upcoming interviews.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
