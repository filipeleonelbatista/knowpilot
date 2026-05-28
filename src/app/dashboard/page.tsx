import { auth } from "@/lib/auth";
import { listUserOrganizations } from "@/lib/org/service";
import { countOwnedFreeOrganizations, FREE_MAX_ORGANIZATIONS } from "@/lib/org/limits";
import { PageHeader } from "@/components/dashboard-shell";
import { CreateOrgForm } from "@/components/create-org-form";
import { DashboardOrgCards } from "@/components/dashboard-org-cards";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;
  const orgs = await listUserOrganizations(userId);
  const freeOrgCount = await countOwnedFreeOrganizations(userId);
  const firstName =
    session?.user?.name?.split(" ")[0] ?? session?.user?.email?.split("@")[0];

  return (
    <div>
      <PageHeader
        title={`Olá, ${firstName}`}
        description={`Organizações no plano Free: ${freeOrgCount}/${FREE_MAX_ORGANIZATIONS}. Cada uma tem KB, atendente e widgets próprios.`}
      />

      {orgs.length === 0 ? (
        <CreateOrgForm
          variant="empty"
          freeOrgCount={freeOrgCount}
          maxFreeOrgs={FREE_MAX_ORGANIZATIONS}
        />
      ) : (
        <div className="space-y-8">
          <CreateOrgForm
            variant="inline"
            freeOrgCount={freeOrgCount}
            maxFreeOrgs={FREE_MAX_ORGANIZATIONS}
          />
          <DashboardOrgCards orgs={orgs} />
        </div>
      )}
    </div>
  );
}
