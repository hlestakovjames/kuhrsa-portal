import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationEventsActivitiesWorkspace from "@/components/administration/AdministrationEventsActivitiesWorkspace";

export default function AdministrationEventLogisticsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationEventsActivitiesWorkspace view="logistics" />
    </ProtectedPortal>
  );
}
