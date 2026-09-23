import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader2, Search, MapPin, Clock, Calendar, CheckCircle } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function TeacherOpportunities({ defaultFilter = 'All' }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(defaultFilter);

  useEffect(() => {
    setFilterType(defaultFilter);
  }, [defaultFilter]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const query = filterType !== 'All' ? `?type=${filterType}` : '';
        const res = await client.get(`/faculty/opportunities${query}`);
        setOpportunities(res.data);
      } catch (err) {
        toast.error('Failed to load opportunities');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, [filterType]);

  const handleApply = (id) => {
    // In a real app this would POST to /faculty/opportunities/{id}/apply
    toast.success("Application submitted successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faculty Opportunities</h1>
          <p className="text-gray-500">Find and apply for industry collaborations, FDPs, and research grants.</p>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm overflow-x-auto w-full md:w-auto">
          {['All', 'Faculty Internship', 'FDP', 'Consultancy', 'Research', 'Mentorship'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === type 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : opportunities.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">No opportunities found for this category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                    {opp.type}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    New
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight">{opp.title}</CardTitle>
                <CardDescription className="font-medium text-gray-700 mt-1">{opp.company}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {opp.location || 'Not specified'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {opp.duration || 'Flexible'}
                  </div>
                  {opp.focus_skills && (
                    <div className="flex items-start mt-3">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs">{opp.focus_skills}</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full mt-auto" 
                  onClick={() => handleApply(opp.id)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
