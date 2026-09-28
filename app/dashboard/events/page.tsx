import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function EventsOverviewPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Events Overview"
      description="Explore KUHRSA events and manage your participation."
      memberView="events-overview"
    />
  );
}
