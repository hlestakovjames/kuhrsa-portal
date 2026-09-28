import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberCommunicationSupportPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Support"
      description="Manage your KUHRSA support requests."
      memberView="communication-support"
    />
  );
}
