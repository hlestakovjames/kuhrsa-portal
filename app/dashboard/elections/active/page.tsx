import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ActiveElectionsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Active Elections"
      description="View current KUHRSA elections."
      memberView="elections-active"
    />
  );
}
