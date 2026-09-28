import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberDashboardPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Member Dashboard"
      description="Manage your KUHRSA membership, account information, renewals and member services from one secure environment."
    />
  );
}