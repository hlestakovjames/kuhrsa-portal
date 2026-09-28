import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationICTWorkspace from "@/components/administration/AdministrationICTWorkspace";

export default function AdministrationICTWebsitePage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationICTWorkspace view="website" />
    </ProtectedPortal>
  );
}
