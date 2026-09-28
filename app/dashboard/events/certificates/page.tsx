import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MemberCertificatesPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Certificates"
      description="View certificates issued for eligible KUHRSA participation."
      memberView="certificates"
    />
  );
}
