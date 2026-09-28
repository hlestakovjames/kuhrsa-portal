import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionCandidatesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="candidates" />
    </ProtectedPortal>
  );
}
