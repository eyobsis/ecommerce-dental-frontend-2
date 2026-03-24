"use client";

import { useEffect, useMemo, useState } from "react";
import { UsersTable } from "./users-table";
import { getUserColumns, User } from "./users-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorBanner } from "@/components/ui/error-banner";
import { ecommerceApi } from "@/lib/ecommerce-api";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError(null);
        const response = await ecommerceApi.getUsers();
        setUsers(response.data as User[]);
      } catch {
        setUsers([]);
        setError("Failed to load users. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
  };

  const columns = getUserColumns(handleEdit);

  // Filter users based on search input
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((user) =>
      [user.name, user.email]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, users]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button>Add User</Button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          disabled={loading}
        />
      </div>

      {error && (
        <ErrorBanner message={error} />
      )}

      {/* Users Table with filtered data */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading users...</div>
      ) : (
        <UsersTable columns={columns} data={filteredUsers} />
      )}
    </div>
  );
};

export default UsersPage;
