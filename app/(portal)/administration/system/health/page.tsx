import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationSystemWorkspace from "@/components/administration/AdministrationSystemWorkspace";

export default function AdministrationSystemHealthPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationSystemWorkspace view="health" />
    </ProtectedPortal>
  );
}
