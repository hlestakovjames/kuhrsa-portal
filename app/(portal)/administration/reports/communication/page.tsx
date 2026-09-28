import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationReportsWorkspace from "@/components/administration/AdministrationReportsWorkspace";

export default function AdministrationCommunicationReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationReportsWorkspace view="communication" />
    </ProtectedPortal>
  );
}
