import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function AccountSettingsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Settings"
      description="Manage your member portal settings."
      memberView="account-settings"
    />
  );
}
