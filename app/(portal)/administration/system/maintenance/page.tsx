import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemMaintenancePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="maintenance" />
    </ProtectedPortal>
  );
}
