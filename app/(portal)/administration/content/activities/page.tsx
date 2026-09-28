import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentActivitiesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="activities" />
    </ProtectedPortal>
  );
}
