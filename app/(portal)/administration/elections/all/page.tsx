import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionsAllPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="elections" />
    </ProtectedPortal>
  );
}
