import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemConfigurationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="configuration" />
    </ProtectedPortal>
  );
}
