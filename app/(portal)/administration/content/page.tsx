import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="dashboard" />
    </ProtectedPortal>
  );
}
