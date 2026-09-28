import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentEventsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="events" />
    </ProtectedPortal>
  );
}
