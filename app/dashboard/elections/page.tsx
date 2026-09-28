import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ElectionsOverviewPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Elections Overview"
      description="Review KUHRSA elections and member voting services."
      memberView="elections-overview"
    />
  );
}
