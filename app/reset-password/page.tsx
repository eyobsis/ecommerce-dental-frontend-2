import { redirect } from "next/navigation";

type LegacyResetPasswordPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function LegacyResetPasswordPage({
  searchParams = {},
}: LegacyResetPasswordPageProps) {
  const query = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => query.append(key, entry));
      return;
    }

    if (typeof value === "string") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  redirect(
    queryString
      ? `/auth/reset-password?${queryString}`
      : "/auth/reset-password",
  );
}
