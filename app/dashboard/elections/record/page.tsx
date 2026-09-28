import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function VotingRecordPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="My Voting Record"
      description="Review your KUHRSA election participation history."
      memberView="elections-record"
    />
  );
}
