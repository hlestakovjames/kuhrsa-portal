import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationDashboardWorkspace from "@/components/administration/AdministrationDashboardWorkspace";

export default function AdministrationDashboardOverviewPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationDashboardWorkspace view="overview" />
    </ProtectedPortal>
  );
}
