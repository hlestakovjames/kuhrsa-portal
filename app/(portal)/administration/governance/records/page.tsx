import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceRecordsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="records" />
    </ProtectedPortal>
  );
}
