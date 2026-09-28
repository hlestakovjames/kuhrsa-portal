import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipFeesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Fees"
      description="Review your KUHRSA membership fees."
      memberView="finance-fees"
    />
  );
}
