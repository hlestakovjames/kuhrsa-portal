import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipRenewalPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="renewal" />
    </ProtectedPortal>
  );
}
