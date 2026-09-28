import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentPagesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="pages" />
    </ProtectedPortal>
  );
}
