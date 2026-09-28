import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function AccountProfilePage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Profile"
      description="Review your KUHRSA account profile."
      memberView="account-profile"
    />
  );
}
