import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberMessagesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Messages"
      description="Review your KUHRSA messages."
      memberView="communication-messages"
    />
  );
}
