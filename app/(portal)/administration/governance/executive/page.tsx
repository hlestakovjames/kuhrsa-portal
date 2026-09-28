import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceExecutivePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="executive" />
    </ProtectedPortal>
  );
}
