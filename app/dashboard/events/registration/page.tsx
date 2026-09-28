import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function EventRegistrationPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Event Registration"
      description="Manage KUHRSA event registrations."
      memberView="event-registration"
    />
  );
}
