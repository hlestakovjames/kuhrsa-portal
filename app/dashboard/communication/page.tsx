import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function CommunicationOverviewPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Communication Overview"
      description="Manage your KUHRSA member communication."
      memberView="communication-overview"
    />
  );
}
