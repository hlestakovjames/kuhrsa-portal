import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernancePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
