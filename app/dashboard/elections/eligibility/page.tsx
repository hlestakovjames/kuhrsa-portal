import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ElectionEligibilityPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Eligibility"
      description="Review your KUHRSA election eligibility."
      memberView="elections-eligibility"
    />
  );
}
