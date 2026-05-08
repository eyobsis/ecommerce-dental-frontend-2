// app/unauthorized.tsx
import Link from "next/link";
export default function Unauthorized() {
  return (
    <html>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
          <h1 className="text-5xl font-bold text-red-600">403</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700">
            Unauthorized Access
          </h2>
          <p className="mt-3 text-gray-500 max-w-md text-center">
            You don’t have permission to view this page. Please sign in with the
            correct account or contact your administrator.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Return Home
          </Link>
        </main>
      </body>
    </html>
  );
}
