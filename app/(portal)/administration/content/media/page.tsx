import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentMediaPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="media" />
    </ProtectedPortal>
  );
}
