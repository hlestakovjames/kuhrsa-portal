"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { AuthUser, canAccessPortal, getLandingPath, getMe, logout, PortalType } from "@/lib/auth";

type PortalSession = { user: AuthUser | null; logout: () => void };
const PortalSessionContext = createContext<PortalSession>({ user: null, logout: () => undefined });

export function usePortalSession() {
  return useContext(PortalSessionContext);
}

function getPortalFromPath(pathname: string): PortalType | null {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return "member";
  if (pathname.startsWith("/executive/")) return "executive";
  if (pathname.startsWith("/administration/")) return "administration";
  return null;
}

export default function PortalSessionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const portal = getPortalFromPath(pathname);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!portal) {
      setLoading(false);
      setError("");
      return () => { active = false; };
    }

    const activePortal = portal;

    async function authenticate() {
      if (user) {
        if (canAccessPortal(user, activePortal)) {
          setError("");
          setLoading(false);
        } else {
          setError("You do not have access to this portal.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");
      try {
        const authenticatedUser = await getMe();
        if (active) {
          setUser(authenticatedUser);
          if (!canAccessPortal(authenticatedUser, activePortal)) {
            setError("You do not have access to this portal.");
          }
        }
      } catch (authError) {
        if (active) {
          setError(authError instanceof Error ? authError.message : "Your session is invalid.");
          logout();
          setUser(null);
          router.replace("/login");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void authenticate();
    return () => { active = false; };
  }, [portal, user, router]);

  const handleReturn = () => {
    if (user) {
      router.replace(getLandingPath(user));
      return;
    }
    handleLogout();
  };

  const handleLogout = () => {
    setUser(null);
    logout();
    router.replace("/login");
  };

  if (!portal) {
    return <PortalSessionContext.Provider value={{ user, logout: handleLogout }}>{children}</PortalSessionContext.Provider>;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6FBFD] px-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#168DB8]/20 border-t-[#168DB8]" />
          <p className="mt-4 text-sm font-semibold text-[#0B2633]">Preparing your secure workspace…</p>
        </div>
      </main>
    );
  }

  if (error || !user || !canAccessPortal(user, portal)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6FBFD] px-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <h1 className="text-xl font-black text-[#0B2633]">Portal access unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-black/60">{error || "Please sign in to continue."}</p>
          <button type="button" onClick={handleReturn} className="mt-6 rounded-full bg-[#168DB8] px-5 py-2.5 text-sm font-bold text-white">{user ? "Return to your workspace" : "Return to login"}</button>
        </div>
      </main>
    );
  }

  return (
    <PortalSessionContext.Provider value={{ user, logout: handleLogout }}>
      <DashboardShell portal={portal} user={user} onLogout={handleLogout}>{children}</DashboardShell>
    </PortalSessionContext.Provider>
  );
}
