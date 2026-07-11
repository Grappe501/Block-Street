import Link from "next/link";
import type { ReactNode } from "react";

export function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="text-sm font-semibold text-blue-800 hover:underline">
            Block Street
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-blue-950">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-blue-800">{subtitle}</p>}
        </div>
        <div className="card border-blue-200 bg-white p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
