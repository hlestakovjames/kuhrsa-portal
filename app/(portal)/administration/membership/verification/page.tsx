import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipVerificationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="verification" />
    </ProtectedPortal>
  );
}
