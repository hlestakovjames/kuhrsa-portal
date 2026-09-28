import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function EventsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Events"
      description="Explore KUHRSA events."
      memberView="events"
    />
  );
}
