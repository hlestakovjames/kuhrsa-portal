import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ServiceRequestStatusPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Request Status"
      description="Track your KUHRSA service request."
      memberView="services-status"
    />
  );
}
