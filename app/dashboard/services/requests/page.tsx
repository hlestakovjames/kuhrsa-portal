import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberServiceRequestsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="My Requests"
      description="Review your KUHRSA service requests."
      memberView="services-requests"
    />
  );
}
