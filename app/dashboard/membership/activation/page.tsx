import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipActivationPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership Activation"
      description="View your KUHRSA membership account activation status."
      memberView="activation"
    />
  );
}
