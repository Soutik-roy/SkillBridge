import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Clock, Video, Loader2, CheckCircle, XCircle } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await client.get('/jobs/recruiter/applications');
      // Filter only applications in INTERVIEW status
      const interviewApps = res.data.filter(app => app.status === 'INTERVIEW');
      setInterviews(interviewApps);
    } catch (err) {
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      await client.put(`/jobs/applications/${appId}/status?status=${newStatus}`);
      toast.success(`Candidate marked as ${newStatus}`);
      fetchInterviews();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleSendLink = (interview) => {
    if (!interview.candidate_email) {
      toast.error("Candidate email not found");
      return;
    }
    
    const meetLink = "https://meet.google.com/new"; // A real valid meeting generator link, or a mock room like abc-defg-hij
    const subject = `Invitation to Interview: ${interview.job_title}`;
    const body = `Dear ${interview.candidate_name},\n\nWe are pleased to invite you to a virtual interview for the ${interview.job_title} position.\n\nPlease join the Google Meet using the link below at the scheduled time:\n\n${meetLink}\n\nWe look forward to speaking with you!\n\nBest regards,\nThe Hiring Team`;
    
    const mailtoLink = `mailto:${interview.candidate_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open default mail client
    window.location.href = mailtoLink;
    toast.success("Drafting email to candidate...");
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Interviews Manager</h1>
        <p className="text-gray-500 mt-1">Manage scheduled interviews, send meeting links, and make final hiring decisions.</p>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Upcoming Interviews</h3>
          <p className="text-gray-500">Shortlist candidates and move them to the interview stage to see them here.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {interviews.map(interview => (
            <Card key={interview.id} className="overflow-hidden flex flex-col">
              <CardHeader className="bg-gray-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{interview.candidate_name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Applying for: <span className="font-medium text-gray-900">{interview.job_title}</span></p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  <div className="flex items-center text-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Virtual Meeting</p>
                      <p className="text-gray-500 text-xs">Link not yet sent</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={() => handleSendLink(interview)}>
                      Send Link
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => updateStatus(interview.id, 'REJECTED')}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => updateStatus(interview.id, 'ACCEPTED')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Hire Candidate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
