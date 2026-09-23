import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Building, ShieldCheck, Save, Loader2 } from 'lucide-react';
import client from '../../api/client';
import toast from 'react-hot-toast';

export default function RecruiterProfile() {
  const [profile, setProfile] = useState({ company_name: '' });
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await client.get('/recruiters/profile');
      setProfile({ company_name: res.data.company_name });
      setStatus(res.data.verification_status);
    } catch (err) {
      toast.error('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await client.put('/recruiters/profile', profile);
      toast.success('Company profile updated successfully');
      setStatus(res.data.verification_status);
    } catch (err) {
      toast.error('Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Company Profile</h1>
        <p className="text-gray-500 mt-1">Manage your company information and verification status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      required
                      value={profile.company_name}
                      onChange={e => setProfile({...profile, company_name: e.target.value})}
                      className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Google, Microsoft"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                {status === 'APPROVED' ? (
                  <>
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Verified Partner</h3>
                    <p className="text-sm text-gray-500 mt-2">Your company is fully verified. Your job postings are visible to all students.</p>
                  </>
                ) : status === 'REJECTED' ? (
                  <>
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Verification Rejected</h3>
                    <p className="text-sm text-gray-500 mt-2">Please contact support for more details regarding your verification.</p>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Verification Pending</h3>
                    <p className="text-sm text-gray-500 mt-2">Your company profile is under review by our team. Most features are still available.</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
