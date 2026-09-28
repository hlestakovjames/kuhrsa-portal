import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentArticlesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="articles" />
    </ProtectedPortal>
  );
}
