import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { 
  Globe, 
  GraduationCap, 
  Microscope, 
  Handshake, 
  Briefcase,
  Loader2,
  Users,
  BookOpen,
  FileText,
  Megaphone
} from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await client.get('/faculty/dashboard-metrics');
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
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  const { metrics, opportunities, readiness: readinessScores } = data || { metrics: {}, opportunities: [], readiness: [] };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academia-Industry Hub</h1>
        <p className="text-gray-500 mt-1">Connect your academic expertise with industry opportunities, research and mentorship.</p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-3xl font-bold mt-1">{metrics.total_students || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Courses</p>
              <h3 className="text-3xl font-bold mt-1">{metrics.active_courses || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Assignments Posted</p>
              <h3 className="text-3xl font-bold mt-1">{metrics.assignments_posted || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Announcements Sent</p>
              <h3 className="text-3xl font-bold mt-1">{metrics.announcements_sent || 0}</h3>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Megaphone className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5 Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:border-blue-500 transition-colors cursor-pointer border-t-4 border-t-blue-500">
          <CardContent className="p-5">
            <Globe className="h-8 w-8 text-blue-600 mb-4" />
            <h4 className="font-bold text-gray-900 mb-1">Faculty Internships</h4>
            <p className="text-xs text-gray-500 mb-4">Industrial training & faculty immersion</p>
          </CardContent>
        </Card>

        <Card className="hover:border-indigo-500 transition-colors cursor-pointer border-t-4 border-t-indigo-500">
          <CardContent className="p-5">
            <GraduationCap className="h-8 w-8 text-indigo-600 mb-4" />
            <h4 className="font-bold text-gray-900 mb-1">FDP & Training</h4>
            <p className="text-xs text-gray-500 mb-4">Certifications and industry-led learning</p>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-500 transition-colors cursor-pointer border-t-4 border-t-orange-500">
          <CardContent className="p-5">
            <Briefcase className="h-8 w-8 text-orange-600 mb-4" />
            <h4 className="font-bold text-gray-900 mb-1">Consultancy</h4>
            <p className="text-xs text-gray-500 mb-4">Solve real industry problems</p>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-500 transition-colors cursor-pointer border-t-4 border-t-purple-500">
          <CardContent className="p-5">
            <Microscope className="h-8 w-8 text-purple-600 mb-4" />
            <h4 className="font-bold text-gray-900 mb-1">Research Collaboration</h4>
            <p className="text-xs text-gray-500 mb-4">Sponsored & joint research</p>
          </CardContent>
        </Card>

        <Card className="hover:border-yellow-500 transition-colors cursor-pointer border-t-4 border-t-yellow-500">
          <CardContent className="p-5">
            <Handshake className="h-8 w-8 text-yellow-600 mb-4" />
            <h4 className="font-bold text-gray-900 mb-1">Industry Mentorship</h4>
            <p className="text-xs text-gray-500 mb-4">Mentor circles and knowledge exchange</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Opportunities Table and Readiness Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Opportunities */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recommended Faculty Opportunities</CardTitle>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">View All</a>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Opportunity</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Duration</th>
                    <th className="px-4 py-3 font-semibold">Focus Skills</th>
                    <th className="px-4 py-3 font-semibold text-center">Match</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className={opp.type === 'Faculty Internship' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100'}>
                          {opp.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-900">{opp.title}</p>
                        <p className="text-xs text-gray-500">{opp.company}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{opp.location}</td>
                      <td className="px-4 py-4 text-gray-600">{opp.duration}</td>
                      <td className="px-4 py-4 text-gray-600 max-w-[150px] truncate" title={opp.skills}>{opp.skills}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md text-xs">
                          {opp.match}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="outline" size="sm" className="w-full">Apply</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Readiness */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Faculty Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 mt-2">
            {readinessScores.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="font-bold text-gray-900">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
