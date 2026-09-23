import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { Target, TrendingUp, BookOpen, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/students/dashboard')
      .then(r => setData(r.data))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load dashboard metrics');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  const stats = [
    { label: "Overall Skill Score", value: data?.avg_skill_score || "0", icon: Target, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Roadmap Progress", value: data?.roadmap?.overall_match_score ? `${Math.round(data.roadmap.overall_match_score)}%` : "0%", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Lessons Completed", value: data?.completed_lessons_count || "0", icon: BookOpen, color: "text-green-600", bg: "bg-green-100" },
    { label: "Applications", value: data?.applications_count || "0", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {user?.email.split('@')[0]}!</h1>
          <p className="text-gray-500 mt-1">Here is your daily career progression summary.</p>
        </div>
        <Link to="/assessment">
          <Button>Take Skill Assessment</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Next Roadmap Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Current Milestone Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data?.roadmap ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{data.roadmap.target_career}</span>
                    <span className="text-gray-500">{Math.round(data.roadmap.overall_match_score)}%</span>
                  </div>
                  <Progress value={data.roadmap.overall_match_score} />
                </div>
                
                <div className="space-y-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700">Recommended Steps:</h4>
                  {data.roadmap.phases?.slice(0, 3).map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className={`text-sm ${idx === 0 ? 'font-medium text-gray-900' : 'font-medium text-gray-500'}`}>{phase.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/roadmap" className="block w-full">
                  <Button variant="outline" className="w-full mt-4">View Full Roadmap</Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">You haven't generated a career roadmap yet.</p>
                <Link to="/roadmap">
                  <Button variant="outline">Create Career Roadmap</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <Target className="w-5 h-5 mr-2 text-indigo-600"/>
              AI Career Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.roadmap?.ai_explanation ? (
              <p className="text-sm text-indigo-800/80 leading-relaxed mb-4 whitespace-pre-line">
                {data.roadmap.ai_explanation}
              </p>
            ) : (
              <p className="text-sm text-indigo-800/80 leading-relaxed mb-4">
                "Complete a skill assessment and generate a roadmap to receive personalized AI insights on your career trajectory."
              </p>
            )}
            
            {data?.roadmap && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2.5 py-1 rounded-md bg-white text-indigo-700 text-xs font-semibold shadow-sm border border-indigo-100">
                  #{data.roadmap.target_career.replace(/\s+/g, '')}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white text-indigo-700 text-xs font-semibold shadow-sm border border-indigo-100">
                  #AIInsights
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Teacher Updates Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Institution & Industry Updates</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Announcements */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {data?.teacher_announcements?.length > 0 ? (
                data.teacher_announcements.map((ann, i) => (
                  <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900">{ann.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{new Date(ann.date).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No recent announcements.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Assignments */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                Pending Assignments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {data?.teacher_assignments?.length > 0 ? (
                data.teacher_assignments.map((ass, i) => (
                  <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-gray-900">{ass.title}</h4>
                      <span className="text-xs font-bold text-indigo-600">{ass.points} pts</span>
                    </div>
                    <span className="text-[11px] font-medium text-red-500 mt-1 block">
                      Due: {new Date(ass.due_date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No pending assignments.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Courses */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                New Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {data?.teacher_courses?.length > 0 ? (
                data.teacher_courses.map((course, i) => (
                  <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{course.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{course.skill}</span>
                      <span className="text-[11px] text-gray-500">{course.level}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No new courses available.</p>
              )}
            </CardContent>
          </Card>

          {/* Job Postings */}
          <Card>
            <CardHeader className="pb-3 border-b bg-indigo-50/30">
              <CardTitle className="text-base flex items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div>
                Latest Job Openings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {data?.latest_jobs?.length > 0 ? (
                data.latest_jobs.map((job, i) => (
                  <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{job.title}</h4>
                    <p className="text-xs font-medium text-indigo-600 mt-1">{job.company}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-400 block">{new Date(job.created_at).toLocaleDateString()}</span>
                      <Link to="/jobs" className="text-xs font-medium text-indigo-600 hover:underline">Apply</Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No active jobs right now.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
