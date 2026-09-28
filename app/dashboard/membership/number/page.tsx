import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipNumberPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Number"
      description="View your KUHRSA membership number."
      memberView="number"
    />
  );
}
