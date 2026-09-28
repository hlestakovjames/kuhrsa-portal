import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationAdministratorAccountsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="administrators" />
    </ProtectedPortal>
  );
}
