import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
