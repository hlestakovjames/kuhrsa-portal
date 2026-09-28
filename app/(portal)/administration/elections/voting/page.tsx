import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionVotingPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="voting" />
    </ProtectedPortal>
  );
}
