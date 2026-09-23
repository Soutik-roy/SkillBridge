import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, TrendingUp, Briefcase, GraduationCap } from 'lucide-react';
import { Progress } from '../../components/ui/Progress';

export default function InstitutionAnalytics() {
  const stats = [
    { label: "Total Students Registered", value: "450", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Avg. Skill Readiness", value: "68%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Placements Secured", value: "112", icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
    { label: "Active Assessments", value: "340", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Institution Analytics</h1>
        <p className="text-gray-500 mt-1">Track your college's performance, skill gaps, and placement readiness.</p>
      </div>

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
        <Card>
          <CardHeader>
            <CardTitle>Top Skill Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>System Design</span>
                <span className="font-bold">High Gap</span>
              </div>
              <Progress value={20} indicatorClassName="bg-red-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Cloud Computing (AWS)</span>
                <span className="font-bold">Medium Gap</span>
              </div>
              <Progress value={45} indicatorClassName="bg-yellow-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Python / Data Analysis</span>
                <span className="font-bold">Low Gap (Strong)</span>
              </div>
              <Progress value={85} indicatorClassName="bg-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placement by Domain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Software Engineering</span>
              <span className="font-bold">45 Placements</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Science & AI</span>
              <span className="font-bold">32 Placements</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Frontend Development</span>
              <span className="font-bold">25 Placements</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cybersecurity</span>
              <span className="font-bold">10 Placements</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
