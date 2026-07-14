import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-2 pr-40 text-center text-xs text-slate-400 sm:pr-52">
        Director Workbench —{" "}
        <Link href="/" className="text-brand-400 hover:underline">
          ← Back to public site
        </Link>
      </div>
      {children}
    </div>
  );
}
