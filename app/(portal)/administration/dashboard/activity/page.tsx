import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationDashboardWorkspace from "@/components/administration/AdministrationDashboardWorkspace";

export default function AdministrationDashboardActivityPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationDashboardWorkspace view="activity" />
    </ProtectedPortal>
  );
}
