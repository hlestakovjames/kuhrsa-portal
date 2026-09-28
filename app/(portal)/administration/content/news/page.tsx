import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentNewsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="news" />
    </ProtectedPortal>
  );
}
