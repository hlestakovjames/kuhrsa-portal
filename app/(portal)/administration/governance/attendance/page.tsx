import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceAttendancePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="attendance" />
    </ProtectedPortal>
  );
}
