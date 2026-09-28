import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSuperAdministratorsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="super-administrators" />
    </ProtectedPortal>
  );
}
