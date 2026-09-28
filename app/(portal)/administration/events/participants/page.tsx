import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationEventsActivitiesWorkspace from "@/components/administration/AdministrationEventsActivitiesWorkspace";

export default function AdministrationParticipantsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationEventsActivitiesWorkspace view="participants" />
    </ProtectedPortal>
  );
}
