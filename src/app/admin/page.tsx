import { getBuildProgress } from "@/lib/data";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdminPageAccess } from "@/lib/admin/guard";

export const metadata = {
  title: "Director Workbench — Block Street",
  description: "Build progress, phases, and deployment tracking",
};

export default async function AdminPage() {
  await requireAdminPageAccess();
  const progress = getBuildProgress();
  return <AdminDashboard progress={progress} />;
}
