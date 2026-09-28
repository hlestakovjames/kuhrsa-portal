import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="reports" />
    </ProtectedPortal>
  );
}
