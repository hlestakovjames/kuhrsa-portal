import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
