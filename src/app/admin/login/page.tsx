import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AdminLoginForm next={params.next ?? "/admin"} />;
}
