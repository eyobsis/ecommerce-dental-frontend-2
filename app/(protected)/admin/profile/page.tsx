'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, Calendar, Shield, CheckCircle } from 'lucide-react';
import ChangePassword from './change-password';
import { useSession } from '@/lib/auth-client';

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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Active
        </span>
      );
    }
    return <span className="text-gray-500">{status}</span>;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex max-w-7xl mx-auto">
          {/* Left Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            </div>
            <nav className="mt-4">
              <button
                onClick={() => setCurrentPage('profile')}
                className={`w-full flex items-center px-8 py-4 text-left transition-all duration-200 ${currentPage === 'profile'
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </button>
              <button
                onClick={() => setCurrentPage('password')}
                className={`w-full flex items-center px-8 py-4 text-left transition-all duration-200 ${currentPage === 'password'
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Shield className="w-5 h-5 mr-3" />
                Password
              </button>
            </nav>
          </aside>

          {/* Main Content - Profile Page */}
          <main className="flex-1 p-10">
            {currentPage === 'profile' && (
              <div className="max-w-5xl mx-auto">
                {/* Header Card with Avatar */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
                  <div className="px-10 pb-10 -mt-16">
                    <div className="flex items-end">
                      <div className="relative">
                        <div className="w-32 h-32 bg-white rounded-full shadow-lg p-2">
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-white">
                            <User className="w-16 h-16 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      <div className="ml-8 mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">{userData.name}</h1>
                        <p className="text-xl text-gray-600 mt-1 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2" />
                          {userData.pos_type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <User className="w-6 h-6 mr-3 text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Full Name</p>
                        <p className="text-lg font-medium text-gray-900">{userData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          Email Address
                        </p>
                        <p className="text-lg font-medium text-gray-900">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Phone Number
                        </p>
                        <p className="text-lg font-medium text-gray-900">{userData.phone_number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Work & Account */}
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                      Work & Account
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Position</p>
                        <p className="text-lg font-medium text-gray-900">{userData.pos_type}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Account Type</p>
                        <p className="text-lg font-medium text-gray-900 capitalize">{userData.accountType.toLowerCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Status</p>
                        {getStatusBadge(userData.employee_status)}
                      </div>
                    </div>
                  </div>

                  {/* Account Creation */}
                  <div className="bg-white rounded-2xl shadow-sm p-8 md:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                      Account Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Member Since</p>
                        <p className="text-lg font-medium text-gray-900">{formatDate(userData.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'password' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Change Password</h1>
                  {/* Your change password form here */}
                  <ChangePassword />

                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

