import ProtectedPortal from "@/components/auth/ProtectedPortal";
import AdministrationAccessWorkspace from "@/components/administration/AdministrationAccessWorkspace";

export default function AdministrationAccessReviewsPage() {
  return (
    <ProtectedPortal portal="administration">
      <AdministrationAccessWorkspace view="reviews" />
    </ProtectedPortal>
  );
}
