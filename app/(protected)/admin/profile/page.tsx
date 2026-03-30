'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Calendar, Shield, CheckCircle } from 'lucide-react';
import ChangePassword from './change-password';
import { useSession } from '@/lib/auth-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  pos_type: string;
  clinic_name: string | null;
  accountType: string;
  employee_status: string;
  createdAt: string;
}



type Page = 'profile' | 'password';

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState<Page>('profile');
  const { data: session } = useSession();

  if (!session?.user) {
    return <>loading</>

  }
  const userData = session?.user;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 px-3 py-1 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" /> Active
        </Badge>
      );
    }
    return <Badge variant="outline" className="text-gray-500 px-3 py-1 text-sm">{status}</Badge>;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-white">
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
          {/* Left Sidebar */}
          <aside className="w-full md:w-64 bg-white shadow-md min-h-screen md:rounded-r-3xl flex-shrink-0">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
            </div>
            <nav className="mt-2 flex flex-row md:flex-col gap-2 md:gap-0">
              <Button
                variant={currentPage === 'profile' ? 'secondary' : 'ghost'}
                className={`w-full justify-start rounded-none md:rounded-r-xl px-8 py-4 text-left text-base font-medium ${currentPage === 'profile' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                onClick={() => setCurrentPage('profile')}
              >
                <User className="w-5 h-5 mr-3" /> Profile
              </Button>
              <Button
                variant={currentPage === 'password' ? 'secondary' : 'ghost'}
                className={`w-full justify-start rounded-none md:rounded-r-xl px-8 py-4 text-left text-base font-medium ${currentPage === 'password' ? 'bg-indigo-50 text-indigo-700' : ''}`}
                onClick={() => setCurrentPage('password')}
              >
                <Shield className="w-5 h-5 mr-3" /> Password
              </Button>
            </nav>
          </aside>
          {/* Main Content - Profile Page */}
          <main className="flex-1 p-4 md:p-10">
            {currentPage === 'profile' && (
              <div className="max-w-5xl mx-auto">
                {/* Header Card with Avatar */}
                <Card className="rounded-3xl shadow-lg overflow-hidden mb-8 border-0">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-32" />
                  <div className="px-6 md:px-10 pb-10 -mt-16">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                      <div className="relative">
                        <Avatar size="lg" className="w-32 h-32 border-4 border-white shadow-lg">
                          <AvatarFallback className="w-full h-full flex items-center justify-center text-4xl bg-slate-200">
                            {userData.name?.[0] || <User className="w-16 h-16 text-gray-500" />}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="md:ml-8 mb-4 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-slate-900">{userData.name}</h1>
                        <p className="text-xl text-slate-600 mt-1 flex items-center justify-center md:justify-start">
                          <Briefcase className="w-5 h-5 mr-2" />
                          {userData.pos_type}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <Card className="rounded-2xl shadow-sm p-8 border-0">
                    <CardHeader className="flex flex-row items-center gap-3 p-0 mb-6">
                      <User className="w-6 h-6 text-indigo-600" />
                      <CardTitle className="text-xl font-semibold text-slate-900">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Full Name</p>
                        <p className="text-lg font-medium text-slate-900">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 flex items-center">
                          <Mail className="w-4 h-4 mr-1" /> Email Address
                        </p>
                        <p className="text-lg font-medium text-slate-900">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1 flex items-center">
                          <Phone className="w-4 h-4 mr-1" /> Phone Number
                        </p>
                        <p className="text-lg font-medium text-slate-900">{userData.phone_number}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Work & Account */}
                  <Card className="rounded-2xl shadow-sm p-8 border-0">
                    <CardHeader className="flex flex-row items-center gap-3 p-0 mb-6">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                      <CardTitle className="text-xl font-semibold text-slate-900">Work & Account</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Position</p>
                        <p className="text-lg font-medium text-slate-900">{userData.pos_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Account Type</p>
                        <p className="text-lg font-medium text-slate-900 capitalize">{userData.accountType.toLowerCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Status</p>
                        {getStatusBadge(userData.employee_status)}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Account Creation */}
                  <Card className="rounded-2xl shadow-sm p-8 border-0 md:col-span-2">
                    <CardHeader className="flex flex-row items-center gap-3 p-0 mb-6">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                      <CardTitle className="text-xl font-semibold text-slate-900">Account Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Member Since</p>
                          <p className="text-lg font-medium text-slate-900">{formatDate(userData.createdAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            {currentPage === 'password' && (
              <div className="max-w-2xl mx-auto">
                <Card className="rounded-2xl shadow-lg p-10 border-0">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-3xl font-bold text-slate-900">Change Password</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ChangePassword />
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

