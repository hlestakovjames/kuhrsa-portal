import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberResourcesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Resources"
      description="Access useful KUHRSA member resources."
      memberView="content-resources"
    />
  );
}
