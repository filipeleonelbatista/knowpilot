import type { Metadata } from "next";
import { LeadsAdminClient } from "./leads-client";

export const metadata: Metadata = {
  title: "Leads Pro",
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return <LeadsAdminClient />;
}
