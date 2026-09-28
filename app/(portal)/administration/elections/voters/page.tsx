import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionVotersPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="voters" />
    </ProtectedPortal>
  );
}
