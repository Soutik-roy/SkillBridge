import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Loader2, Link as LinkIcon, Building2 } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function IndustryProgramsList() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await client.get('/jobs/programs');
      setPrograms(res.data);
    } catch (err) {
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Industry Learning Programs</h1>
        <p className="text-gray-500 mt-1">Discover specialized training programs and upskilling opportunities directly from top tech companies.</p>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No active programs right now</h3>
          <p className="text-gray-500">Check back later for new upskilling opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {programs.map(program => (
            <Card key={program.id} className="hover:shadow-md transition-all border-l-4 border-indigo-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Industry Partner</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{program.description}</p>
                    
                    {program.url && (
                      <a 
                        href={program.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" /> 
                        Register for Program
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
