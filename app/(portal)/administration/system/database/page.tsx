import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemDatabasePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="database" />
    </ProtectedPortal>
  );
}
