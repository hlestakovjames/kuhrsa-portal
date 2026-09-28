import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentPublishingPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="publishing" />
    </ProtectedPortal>
  );
}
