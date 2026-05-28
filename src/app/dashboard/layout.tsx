import { auth } from "@/lib/auth";
import { listUserOrganizations } from "@/lib/org/service";
import { DashboardNav } from "@/components/dashboard-nav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orgs = await listUserOrganizations(session.user.id);

  return (
    <div className="mesh-bg min-h-screen">
      <DashboardNav orgs={orgs} />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</div>
    </div>
  );
}
