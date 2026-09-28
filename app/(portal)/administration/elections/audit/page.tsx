import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionAuditPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="audit" />
    </ProtectedPortal>
  );
}
