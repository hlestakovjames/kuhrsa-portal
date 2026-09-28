import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceAgendasPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="agendas" />
    </ProtectedPortal>
  );
}
