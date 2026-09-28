import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationMembershipWorkspace from "@/components/administration/AdministrationMembershipWorkspace";

export default function AdministrationMembershipMigrationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationMembershipWorkspace view="migration" />
    </ProtectedPortal>
  );
}
