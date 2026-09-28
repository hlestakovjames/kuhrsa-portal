import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipActivePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="active" />
    </ProtectedPortal>
  );
}
