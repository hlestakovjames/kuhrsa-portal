import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberServicesHelpPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Help & Support"
      description="Find help with KUHRSA member services."
      memberView="services-help"
    />
  );
}
