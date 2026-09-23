import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader2, Calendar, FileText, UploadCloud, CheckCircle2 } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We can reuse the student dashboard endpoint and extract just the assignments
    // Or call a dedicated endpoint. Let's just fetch the dashboard payload which has them.
    const fetchAssignments = async () => {
      try {
        const res = await client.get('/students/dashboard');
        // The dashboard returns teacher_assignments
        setAssignments(res.data.teacher_assignments || []);
      } catch (err) {
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const isOverdue = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-500 mt-1">Complete tasks assigned by your institution to earn points.</p>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-16 bg-gray-50 border-dashed border-2">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Assignments</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              You don't have any pending assignments from your teachers right now.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className={
                      isOverdue(assignment.due_date) ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }>
                      {isOverdue(assignment.due_date) ? 'Overdue' : 'Active'}
                    </Badge>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{assignment.title}</h3>
                  <p className="text-sm font-semibold text-indigo-600 mt-1">{assignment.points} Points possible</p>
                  
                  {/* For the MVP, we just show a placeholder description if none exists in the API payload */}
                  <p className="text-gray-600 text-sm mt-4">
                    Please submit your work before the deadline. Make sure all requirements are met.
                  </p>
                </div>
                
                <div className="bg-gray-50 md:w-64 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-center items-center text-center">
                  <div className="mb-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-dashed border-gray-300">
                      <UploadCloud className="h-5 w-5 text-gray-400" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-4">No submission yet</p>
                  <Button className="w-full" onClick={() => toast.success('Submission feature coming soon!')}>
                    Submit Work
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
