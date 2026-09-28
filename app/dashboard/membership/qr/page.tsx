import ProtectedDashboard from "@/components/auth/ProtectedDashboard";

export default function MembershipQrPage() {
  return (
    <ProtectedDashboard
      portal="member"
      title="Membership QR Code"
      description="Access your secure KUHRSA membership QR reference."
      memberView="qr"
    />
  );
}
