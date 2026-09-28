import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationReportsWorkspace from "@/components/administration/AdministrationReportsWorkspace";

export default function AdministrationMembershipReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationReportsWorkspace view="membership" />
    </ProtectedPortal>
  );
}
