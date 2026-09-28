import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceMinutesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="minutes" />
    </ProtectedPortal>
  );
}
