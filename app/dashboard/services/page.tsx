import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberServicesOverviewPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Services Overview"
      description="Access KUHRSA member services."
      memberView="services-overview"
    />
  );
}
