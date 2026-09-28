import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationEventsActivitiesWorkspace from "@/components/administration/AdministrationEventsActivitiesWorkspace";

export default function AdministrationVenuesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationEventsActivitiesWorkspace view="venues" />
    </ProtectedPortal>
  );
}
