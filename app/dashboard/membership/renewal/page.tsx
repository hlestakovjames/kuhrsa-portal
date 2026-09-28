import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipRenewalPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Renewal"
      description="Review your KUHRSA membership renewal information."
      memberView="renewal"
    />
  );
}
