import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function FinanceOverviewPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Finance Overview"
      description="View your KUHRSA finance information."
      memberView="finance-overview"
    />
  );
}
