"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { showError, showSuccess } from "@/app/utils/message";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { changePassword, useSession } from "@/lib/auth-client";

// Import Better Auth client and hook

const ChangePassword = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  console.log("getting user data ", user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    if (password.length < minLength)
      return "Password must be at least 8 characters";
    if (!hasUpperCase) return "Password must contain an uppercase letter";
    if (!hasLowerCase) return "Password must contain a lowercase letter";
    if (!hasNumber) return "Password must contain a number";
    if (!hasSpecialChar) return "Password must contain a special character";

    return null;
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("Please fill in all fields.");
      return;
    }

    if (newPassword === currentPassword) {
      showError("New password must be different from the current password.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      showError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true, // Optional but recommended
      });

      if (error) {
        showError(
          error.message ||
            "Failed to change password. Please check your current password.",
        );
      } else {
        showSuccess(data?.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="text-center mt-10">Loading session...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        You must be logged in to change your password.
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Ensure your account is using a strong and unique password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Revoke Sessions Checkbox */}
        {/*
        <div className="flex items-center space-x-2">
          <Checkbox
            id="revoke"
            checked={revokeOtherSessions}
            onCheckedChange={(checked) =>
              setRevokeOtherSessions(checked as boolean)
            }
          />
          <label
            htmlFor="revoke"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Log out from all other devices
          </label>
        </div>
        */}

        {/* Password Requirements */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Password must contain:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>At least 8 characters</li>
            <li>One uppercase and one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character (e.g. !@#$%)</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Logged in as: <span className="font-medium">{user.email}</span>
        </p>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChangePassword;
