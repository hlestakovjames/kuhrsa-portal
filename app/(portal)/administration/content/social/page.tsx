import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentSocialPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="social" />
    </ProtectedPortal>
  );
}
