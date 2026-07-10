import { getBuildProgress } from "@/lib/data";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Director Workbench — Block Street",
  description: "Build progress, phases, and deployment tracking",
};

export default function AdminPage() {
  const progress = getBuildProgress();
  return <AdminDashboard progress={progress} />;
}
