import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ActivitiesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Activities"
      description="Explore KUHRSA activities."
      memberView="activities"
    />
  );
}
