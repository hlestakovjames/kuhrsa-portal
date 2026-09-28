import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberDownloadsPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Downloads"
      description="Access KUHRSA forms, documents and guides."
      memberView="content-downloads"
    />
  );
}
