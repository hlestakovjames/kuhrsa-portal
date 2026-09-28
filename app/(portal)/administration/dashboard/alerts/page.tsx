import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationDashboardWorkspace from "@/components/administration/AdministrationDashboardWorkspace";

export default function AdministrationDashboardAlertsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationDashboardWorkspace view="alerts" />
    </ProtectedPortal>
  );
}
