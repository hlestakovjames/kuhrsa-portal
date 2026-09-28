import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSecretariatWorkspace from "@/components/administration/AdministrationSecretariatWorkspace";

export default function AdministrationSecretariatPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSecretariatWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
