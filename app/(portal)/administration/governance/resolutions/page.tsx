import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationGovernanceWorkspace from "@/components/administration/AdministrationGovernanceWorkspace";

export default function AdministrationGovernanceResolutionsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationGovernanceWorkspace view="resolutions" />
    </ProtectedPortal>
  );
}
