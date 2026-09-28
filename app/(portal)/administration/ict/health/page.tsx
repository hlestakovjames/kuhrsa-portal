import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTHealthPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="health" />
    </ProtectedPortal>
  );
}
