import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function UpcomingActivitiesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Upcoming Activities"
      description="View upcoming KUHRSA activities."
      memberView="upcoming-activities"
    />
  );
}
