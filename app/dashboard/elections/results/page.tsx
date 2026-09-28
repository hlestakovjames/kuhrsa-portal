import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ElectionResultsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Results"
      description="View published KUHRSA election results."
      memberView="elections-results"
    />
  );
}
