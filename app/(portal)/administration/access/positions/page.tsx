import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationPositionAssignmentsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="positions" />
    </ProtectedPortal>
  );
}
