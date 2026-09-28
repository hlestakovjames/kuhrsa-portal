import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function AccountSecurityPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Security"
      description="Review your account security."
      memberView="account-security"
    />
  );
}
