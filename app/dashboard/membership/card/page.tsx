import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipCardPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Card"
      description="View your digital KUHRSA membership card."
      memberView="card"
    />
  );
}
