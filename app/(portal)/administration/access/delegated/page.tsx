import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationDelegatedAccessPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="delegated" />
    </ProtectedPortal>
  );
}
