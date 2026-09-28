import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSecretariatWorkspace from "@/components/administration/AdministrationSecretariatWorkspace";

export default function AdministrationSecretariatCorrespondencePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSecretariatWorkspace view="correspondence" />
    </ProtectedPortal>
  );
}
