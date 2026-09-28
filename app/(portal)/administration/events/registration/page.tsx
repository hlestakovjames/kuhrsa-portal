import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationEventsActivitiesWorkspace from "@/components/administration/AdministrationEventsActivitiesWorkspace";

export default function AdministrationEventRegistrationPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationEventsActivitiesWorkspace view="event-registration" />
    </ProtectedPortal>
  );
}
