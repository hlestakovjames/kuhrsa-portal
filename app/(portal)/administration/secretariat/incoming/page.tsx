import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSecretariatWorkspace from "@/components/administration/AdministrationSecretariatWorkspace";

export default function AdministrationSecretariatIncomingPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSecretariatWorkspace view="incoming" />
    </ProtectedPortal>
  );
}
