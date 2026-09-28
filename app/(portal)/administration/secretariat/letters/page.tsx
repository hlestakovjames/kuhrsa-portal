import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSecretariatWorkspace from "@/components/administration/AdministrationSecretariatWorkspace";

export default function AdministrationSecretariatLettersPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSecretariatWorkspace view="letters" />
    </ProtectedPortal>
  );
}
