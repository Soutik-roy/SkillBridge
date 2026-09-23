import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ first_name: '', last_name: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    client.get('/students/profile')
      .then(res => {
        setFormData({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
        });
      })
      .catch(err => {
        console.error(err);
        // It's possible the user doesn't have a profile record yet
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.first_name || !formData.last_name) {
      toast.error('First and last name are required');
      return;
    }
    setSaving(true);
    try {
      await client.put('/students/profile', formData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="First Name" 
              name="first_name"
              placeholder="John" 
              value={formData.first_name}
              onChange={handleChange}
            />
            <Input 
              label="Last Name" 
              name="last_name"
              placeholder="Doe" 
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <Input label="Email" value={user?.email || ''} disabled />
          
          <Button className="mt-4" onClick={handleSave} isLoading={saving}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
