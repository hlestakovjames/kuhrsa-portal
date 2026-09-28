import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemSettingsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="settings" />
    </ProtectedPortal>
  );
}
