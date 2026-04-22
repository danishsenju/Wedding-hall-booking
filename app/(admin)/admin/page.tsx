import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function AdminIndexPage() {
  const token = cookies().get("admin-token")?.value;
  if (token) redirect("/admin/dashboard");
  redirect("/admin/login");
}
