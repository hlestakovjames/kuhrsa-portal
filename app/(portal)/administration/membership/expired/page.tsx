import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipExpiredPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="expired" />
    </ProtectedPortal>
  );
}
