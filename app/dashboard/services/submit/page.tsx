import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function SubmitServiceRequestPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Submit Request"
      description="Submit a KUHRSA member service request."
      memberView="services-submit"
    />
  );
}
