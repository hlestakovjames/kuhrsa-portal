import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function OutstandingBalancePage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Outstanding Balance"
      description="View your current KUHRSA membership balance."
      memberView="finance-balance"
    />
  );
}
