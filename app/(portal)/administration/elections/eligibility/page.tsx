import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionEligibilityPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="eligibility" />
    </ProtectedPortal>
  );
}
