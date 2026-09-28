import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function LoginHistoryPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Login History"
      description="Review your recent account sign-in activity."
      memberView="account-login-history"
    />
  );
}
