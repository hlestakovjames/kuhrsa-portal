import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function NotificationPreferencesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Notification Preferences"
      description="Manage your KUHRSA communication preferences."
      memberView="communication-preferences"
    />
  );
}
