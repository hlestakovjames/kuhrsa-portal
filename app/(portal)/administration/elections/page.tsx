import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationElectionsWorkspace from "@/components/administration/AdministrationElectionsWorkspace";

export default function AdministrationElectionsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationElectionsWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
