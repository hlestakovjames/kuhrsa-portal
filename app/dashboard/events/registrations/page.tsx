import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MyRegistrationsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="My Registrations"
      description="Review your KUHRSA event and activity registrations."
      memberView="registrations"
    />
  );
}
