import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationResourcesWorkspace from "@/components/administration/AdministrationResourcesWorkspace";

export default function AdministrationResourcesCategoriesPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationResourcesWorkspace view="categories" />
    </ProtectedPortal>
  );
}
