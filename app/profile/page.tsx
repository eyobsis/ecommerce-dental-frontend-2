"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Shield,
  Chrome,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ChangePassword from "./change-password";
import { authClient, useSession } from "@/lib/auth-client";

type Page = "profile" | "password";

type SocialProviderKey = "google" | "facebook" | "twitter";

const socialProviders: Array<{
  key: SocialProviderKey;
  label: string;
  icon: typeof Chrome;
}> = [
  { key: "google", label: "Google", icon: Chrome },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "twitter", label: "Twitter", icon: Twitter },
];

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState<Page>("profile");
  const [linkingProvider, setLinkingProvider] = useState<SocialProviderKey | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<SocialProviderKey | null>(null);
  const [enabledProviders, setEnabledProviders] = useState<SocialProviderKey[]>([
    "google",
    "facebook",
    "twitter",
  ]);
  const [accountActionError, setAccountActionError] = useState<string | null>(null);
  const [accountActionSuccess, setAccountActionSuccess] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { providers?: SocialProviderKey[] };
        if (Array.isArray(data.providers)) {
          setEnabledProviders(data.providers);
        }
      } catch {
        // Keep optimistic defaults if provider list cannot be loaded.
      }
    };

    void loadProviders();
  }, []);

  const visibleSocialProviders = useMemo(
    () => socialProviders.filter((provider) => enabledProviders.includes(provider.key)),
    [enabledProviders],
  );

  if (!session?.user) {
    return <>loading</>;
  }
  const userData = session?.user;

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLinkAccount = async (provider: SocialProviderKey) => {
    setAccountActionError(null);
    setAccountActionSuccess(null);
    setLinkingProvider(provider);

    try {
      await authClient.linkSocial({
        provider,
        callbackURL: "/profile",
      });
      setAccountActionSuccess(`Successfully linked ${provider}.`);
    } catch {
      setAccountActionError(`Unable to link ${provider}. Please try again.`);
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleUnlinkAccount = async (provider: SocialProviderKey) => {
    setAccountActionError(null);
    setAccountActionSuccess(null);
    setUnlinkingProvider(provider);

    try {
      await authClient.unlinkAccount({
        providerId: provider,
      });
      setAccountActionSuccess(`Successfully disconnected ${provider}.`);
    } catch {
      setAccountActionError(`Unable to disconnect ${provider}. Please try again.`);
    } finally {
      setUnlinkingProvider(null);
    }
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
                onClick={() => setCurrentPage("profile")}
                className={`w-full flex items-center px-8 py-4 text-left transition-all duration-200 ${
                  currentPage === "profile"
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </button>
              <button
                onClick={() => setCurrentPage("password")}
                className={`w-full flex items-center px-8 py-4 text-left transition-all duration-200 ${
                  currentPage === "password"
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Shield className="w-5 h-5 mr-3" />
                Password
              </button>
            </nav>
          </aside>

          {/* Main Content - Profile Page */}
          <main className="flex-1 p-10">
            {currentPage === "profile" && (
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
                        <p className="text-lg font-medium text-gray-900">
                          {userData.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          Email Address
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {userData.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          Phone Number
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {userData.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work & Account */}
                  <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                      Work & Account
                    </h3>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Connect a social account to make future sign-ins easier.
                      </p>

                      {accountActionError ? (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                          {accountActionError}
                        </p>
                      ) : null}

                      {accountActionSuccess ? (
                        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                          {accountActionSuccess}
                        </p>
                      ) : null}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {visibleSocialProviders.map(({ key, label, icon: Icon }) => (
                          <div key={key} className="space-y-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleLinkAccount(key)}
                              disabled={linkingProvider !== null || unlinkingProvider !== null}
                              className="h-11 w-full justify-start gap-2"
                            >
                              {linkingProvider === key ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Icon className="h-4 w-4" />
                              )}
                              {linkingProvider === key ? `Linking ${label}` : `Link ${label}`}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleUnlinkAccount(key)}
                              disabled={linkingProvider !== null || unlinkingProvider !== null}
                              className="h-10 w-full justify-start px-3 text-sm text-slate-600"
                            >
                              {unlinkingProvider === key ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : null}
                              {unlinkingProvider === key
                                ? `Disconnecting ${label}`
                                : `Disconnect ${label}`}
                            </Button>
                          </div>
                        ))}
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
                        <p className="text-sm text-gray-500 mb-1">
                          Member Since
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {formatDate(userData.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === "password" && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Change Password
                  </h1>
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
