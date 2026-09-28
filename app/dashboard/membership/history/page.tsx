import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipHistoryPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership History"
      description="View your previous KUHRSA membership periods."
      memberView="history"
    />
  );
}
