// app/users/users-columns.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type User = {
  id: string;
  name: string | null;
  email: string;
  userStatus: "active" | "inactive" | "pending" | "blocked";
  userType: "owner" | "admin" | "accountant" | "client" | "super_admin";
  createdAt: string;
};

export const getUserColumns = (onEdit: (user: User) => void) => [
  {
    key: "name",
    header: "Name",
    render: (u: User) => u.name ?? "-",
  },
  {
    key: "email",
    header: "Email",
  },
  {
    key: "userType",
    header: "Type",
    render: (u: User) => <Badge variant="secondary">{u.userType}</Badge>,
  },
  {
    key: "userStatus",
    header: "Status",
    render: (u: User) => {
      const colorMap = {
        active: "default",
        inactive: "secondary",
        pending: "outline",
        blocked: "destructive",
      } as const;

      return <Badge variant={colorMap[u.userStatus]}>{u.userStatus}</Badge>;
    },
  },
  {
    key: "createdAt",
    header: "Created",
    render: (u: User) => new Date(u.createdAt).toLocaleDateString(),
  },
  // {
  //   key: "actions",
  //   header: "Actions",
  //   render: (u: User) => (
  //     <Button size="sm" variant="outline" onClick={() => onEdit(u)}>
  //       Edit
  //     </Button>
  //   ),
  // },
];
