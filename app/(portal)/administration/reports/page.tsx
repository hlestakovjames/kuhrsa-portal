import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationReportsWorkspace from "@/components/administration/AdministrationReportsWorkspace";

export default function AdministrationReportsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationReportsWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
