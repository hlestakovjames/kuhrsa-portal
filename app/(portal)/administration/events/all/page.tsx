import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationEventsActivitiesWorkspace from "@/components/administration/AdministrationEventsActivitiesWorkspace";

export default function AdministrationEventsAllPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationEventsActivitiesWorkspace view="events" />
    </ProtectedPortal>
  );
}
