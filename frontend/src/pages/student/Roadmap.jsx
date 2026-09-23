import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Map, Zap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function Roadmap() {
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await client.post('/engine/recommend-careers', {
        student_skills: [],
        top_n: 3
      });
      setCareers(res.data);
    } catch (err) {
      toast.error("Failed to load career recommendations");
    } finally {
      setLoadingCareers(false);
    }
  };

  const generateRoadmap = async (careerId) => {
    setLoadingRoadmap(true);
    setSelectedCareer(careerId);
    try {
      const res = await client.post('/engine/roadmap', {
        student_skills: [],
        target_career_id: careerId
      });
      setRoadmap(res.data);
      toast.success("AI Roadmap Generated!");
    } catch (err) {
      toast.error("Failed to generate roadmap");
      setSelectedCareer(null);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Career Roadmap</h1>
        <p className="text-gray-500 mt-1">Select an AI-recommended career path to generate your personalized learning roadmap.</p>
      </div>

      {!roadmap ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          {loadingCareers ? (
            <div className="grid md:grid-cols-3 gap-4">
               {[1,2,3].map(i => <Card key={i} className="h-40 animate-pulse bg-gray-100" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {careers.map((c) => (
                <Card key={c.career_id} className="hover:border-indigo-500 transition-colors flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{c.title}</CardTitle>
                    <p className="text-sm text-gray-500">{c.domain}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Match Score</span>
                        <span className="font-bold">{c.match_score}%</span>
                      </div>
                      <Progress value={c.match_score} />
                    </div>
                    <Button 
                      onClick={() => generateRoadmap(c.career_id)} 
                      isLoading={loadingRoadmap && selectedCareer === c.career_id}
                      disabled={loadingRoadmap}
                    >
                      Generate Roadmap
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setRoadmap(null)}>
            &larr; Choose another career
          </Button>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-gray-900 text-white">
              <CardHeader>
                <CardTitle className="text-gray-100 text-2xl">{roadmap.target_career}</CardTitle>
                <Badge className="w-fit mt-2" variant="outline">{roadmap.readiness.replace('_', ' ')}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Match Score</p>
                  <div className="text-4xl font-bold text-indigo-400">{roadmap.match_score}%</div>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">AI Guidance</p>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {roadmap.ai_explanation}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-bold flex items-center">
                <Map className="w-6 h-6 mr-2 text-indigo-600" /> 
                Phase-by-Phase Plan ({roadmap.total_weeks} Weeks)
              </h3>
              
              {roadmap.phases.map((phase) => (
                <Card key={phase.phase} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-indigo-600 mb-1">PHASE {phase.phase}</p>
                        <CardTitle className="text-lg">{phase.title}</CardTitle>
                      </div>
                      <Badge variant="outline">{phase.duration_weeks} Weeks</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{phase.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 space-y-3">
                      {phase.actions.map((action, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 mr-3 text-gray-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{action}</span>
                        </div>
                      ))}
                    </div>
                    {phase.courses.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recommended Courses</p>
                        <div className="space-y-2">
                          {phase.courses.map((c, i) => (
                            <a key={i} href={c.url} className="block p-3 rounded-md border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium">{c.title}</p>
                                  <p className="text-xs text-gray-500">{c.provider} • {c.duration_weeks} weeks</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
