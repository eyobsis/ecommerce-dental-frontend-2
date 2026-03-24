import db from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  // 2. Fetch role from DB
  const loggedInUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  const userRecord = loggedInUser[0];

  if (!userRecord) {
    redirect("/");
  }

  if (userRecord.accountType !== "ADMIN") {
    redirect("/");
  }

  // 5. Render children if authorized
  return <>{children}</>;
}
