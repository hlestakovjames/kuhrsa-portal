"use client";

import Link from "next/link";
import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AuthUser,
  canAccessPortal,
  getMe,
  logout,
  PortalType,
} from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

type ProtectedPortalProps = {
  portal: PortalType;
  children: ReactNode;
};

export default function ProtectedPortal({
  portal,
  children,
}: ProtectedPortalProps) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function authenticate() {
      try {
        const authenticatedUser =
          await getMe();

        if (
          !canAccessPortal(
            authenticatedUser,
            portal,
          )
        ) {
          throw new Error(
            "You do not have access to this portal.",
          );
        }

        if (mounted) {
          setUser(authenticatedUser);
        }
      } catch (portalError) {
        if (mounted) {
          setError(
            portalError instanceof Error
              ? portalError.message
              : "Your session is invalid or this portal could not be loaded.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void authenticate();

    return () => {
      mounted = false;
    };
  }, [portal]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6FBFD] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-black/5 sm:p-10">
            <div className="h-4 w-32 animate-pulse rounded-full bg-black/5" />

            <div className="mt-4 h-10 max-w-md animate-pulse rounded-xl bg-black/5" />

            <div className="mt-4 h-5 max-w-2xl animate-pulse rounded-xl bg-black/5" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl bg-[#F4FAFC]"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-[#F6FBFD] px-4 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-[2rem] bg-white text-center shadow-xl ring-1 ring-black/5">
            <div className="h-1.5 bg-[#F700BA]" />

            <div className="p-8 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F700BA]">
                Access Restricted
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0B2633]">
                Portal access unavailable
              </h1>

              <p className="mx-auto mt-4 max-w-lg leading-7 text-black/60">
                {error}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[#168DB8] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#11799D]"
                >
                  Return to Login
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-black/10 px-6 py-3 text-sm font-bold text-[#0B2633] transition hover:bg-black/[0.03]"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <DashboardShell
      portal={portal}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}