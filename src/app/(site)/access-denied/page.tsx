export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <div className="card max-w-md border-blue-200 bg-white p-6 text-center">
        <h1 className="text-xl font-bold text-blue-950">Access not available</h1>
        <p className="mt-2 text-sm text-blue-800">You do not have permission to view this area, or your session may have expired.</p>
        <a href="/login" className="mt-4 inline-block text-sm text-blue-700 underline">Sign in again</a>
      </div>
    </div>
  );
}
