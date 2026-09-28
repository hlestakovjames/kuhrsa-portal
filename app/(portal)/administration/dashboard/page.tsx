import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationDashboardWorkspace from "@/components/administration/AdministrationDashboardWorkspace";

export default function AdministrationDashboardPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationDashboardWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
