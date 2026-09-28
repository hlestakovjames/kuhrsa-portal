import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipVerificationPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Member Verification"
      description="Review the verification status of your KUHRSA membership."
      memberView="verification"
    />
  );
}
