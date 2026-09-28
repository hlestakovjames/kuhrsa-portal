import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function UpcomingEventsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Upcoming Events"
      description="View upcoming KUHRSA events."
      memberView="upcoming-events"
    />
  );
}
