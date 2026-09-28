import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function ElectionVotingPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Voting"
      description="Review your voting status and election instructions."
      memberView="elections-voting"
    />
  );
}
