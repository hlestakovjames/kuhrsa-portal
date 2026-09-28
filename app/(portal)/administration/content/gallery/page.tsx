import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationContentWorkspace from "@/components/administration/AdministrationContentWorkspace";

export default function AdministrationContentGalleryPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationContentWorkspace view="gallery" />
    </ProtectedPortal>
  );
}
