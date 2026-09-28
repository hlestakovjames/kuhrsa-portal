import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberFeedbackPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Feedback"
      description="Submit and review KUHRSA member feedback."
      memberView="communication-feedback"
    />
  );
}
