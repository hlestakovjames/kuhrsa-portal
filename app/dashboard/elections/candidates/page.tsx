import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ElectionCandidatesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Candidates"
      description="Review candidates in the current KUHRSA election."
      memberView="elections-candidates"
    />
  );
}
