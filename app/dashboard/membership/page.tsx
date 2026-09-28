import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipOverviewPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Overview"
      description="View your current KUHRSA membership information."
      memberView="overview"
    />
  );
}
