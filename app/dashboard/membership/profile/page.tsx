import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberProfilePage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="My Profile"
      description="Review your KUHRSA membership profile."
      memberView="profile"
    />
  );
}
