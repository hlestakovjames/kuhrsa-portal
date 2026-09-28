import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberNotificationsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Notifications"
      description="Review your KUHRSA notifications."
      memberView="communication-notifications"
    />
  );
}
