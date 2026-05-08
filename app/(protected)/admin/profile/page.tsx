'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Shield,
  CheckCircle,
  Sparkles,
  Settings,
} from 'lucide-react';
import ChangePassword from './change-password';
import { useSession } from '@/lib/auth-client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

type Page = 'profile' | 'password';

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState<Page>('profile');
  const { data: session } = useSession();

  if (!session?.user) {
    return <>loading</>;
  }
  const userData = session.user;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-white shadow-sm ring-1 ring-slate-200/70">
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Account center
                </p>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Profile & Security
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your personal profile details and security settings.
                </p>
              </div>
              <div className="rounded-xl border bg-white/80 px-3 py-2 text-sm text-muted-foreground">
                Last active: {formatDate(userData.createdAt)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={currentPage} onValueChange={(value) => setCurrentPage(value as Page)} className="mt-6 gap-4">
          <TabsList className="h-auto w-full justify-start rounded-xl border bg-card p-1 md:w-fit">
            <TabsTrigger value="profile" className="gap-2 px-4 py-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2 px-4 py-2">
              <Shield className="h-4 w-4" />
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <div className="h-28 bg-gradient-to-r from-indigo-500/90 via-blue-500/90 to-cyan-500/90" />
              <CardContent className="-mt-10 p-5 md:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <Avatar size="lg" className="h-20 w-20 border-4 border-background shadow-md">
                    <AvatarFallback className="text-2xl font-semibold">
                      {userData.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{userData.name}</h2>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {userData.pos_type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2 border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Basic account contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InfoField label="Full Name" value={userData.name} icon={<User className="h-4 w-4" />} />
                    <InfoField label="Email Address" value={userData.email} icon={<Mail className="h-4 w-4" />} />
                    <InfoField label="Phone Number" value={userData.phone_number || 'Not set'} icon={<Phone className="h-4 w-4" />} />
                    <InfoField label="Position" value={userData.pos_type || 'Not set'} icon={<Briefcase className="h-4 w-4" />} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoField
                    label="Account Type"
                    value={userData.accountType?.toLowerCase() || 'Unknown'}
                    capitalize
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Employee Status</p>
                    <div className="mt-2">{getStatusBadge(userData.employee_status)}</div>
                  </div>
                  <Separator />
                  <InfoField
                    label="Member Since"
                    value={formatDate(userData.createdAt)}
                    icon={<Calendar className="h-4 w-4" />}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <div className="w-full max-w-3xl">
              <ChangePassword />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
  capitalize = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className={`text-sm font-semibold text-foreground ${capitalize ? 'capitalize' : ''}`}>{value}</p>
    </div>
  );
}

