import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionPositionsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="positions" />
    </ProtectedPortal>
  );
}
