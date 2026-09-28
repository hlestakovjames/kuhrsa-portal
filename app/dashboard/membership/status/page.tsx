import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipStatusPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Status"
      description="Check your KUHRSA membership status."
      memberView="status"
    />
  );
}
