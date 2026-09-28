import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ActivityRegistrationPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Activity Registration"
      description="Manage KUHRSA activity registrations."
      memberView="activity-registration"
    />
  );
}
