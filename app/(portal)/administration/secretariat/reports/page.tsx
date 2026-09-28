import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSecretariatWorkspace from "@/components/administration/AdministrationSecretariatWorkspace";

export default function AdministrationSecretariatReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSecretariatWorkspace view="reports" />
    </ProtectedPortal>
  );
}
