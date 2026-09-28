import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSecretariatWorkspace from "@/components/administration/AdministrationSecretariatWorkspace";

export default function AdministrationSecretariatDocumentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSecretariatWorkspace view="documents" />
    </ProtectedPortal>
  );
}
