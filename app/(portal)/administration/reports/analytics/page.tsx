import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationReportsWorkspace from "@/components/administration/AdministrationReportsWorkspace";

export default function AdministrationMembershipAnalyticsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationReportsWorkspace view="analytics" />
    </ProtectedPortal>
  );
}
