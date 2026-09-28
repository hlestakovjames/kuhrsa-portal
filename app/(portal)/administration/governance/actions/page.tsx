import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceActionsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="actions" />
    </ProtectedPortal>
  );
}
