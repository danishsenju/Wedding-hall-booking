import AdminShell from "@/components/admin/AdminShell";

export default function AdminNestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
