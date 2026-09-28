"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AuthUser,
  canAccessPortal,
  getMe,
  getToken,
  logout,
  PortalType,
} from "@/lib/auth";

import DashboardShell from "@/components/dashboard/DashboardShell";
import ExecutiveDashboardWorkspace from "@/components/executive/ExecutiveDashboardWorkspace";
import MemberAccountWorkspace from "@/components/member/MemberAccountWorkspace";
import MemberCommunicationWorkspace from "@/components/member/MemberCommunicationWorkspace";
import MemberContentWorkspace from "@/components/member/MemberContentWorkspace";
import MemberDashboardWorkspace from "@/components/member/MemberDashboardWorkspace";
import MemberElectionsWorkspace from "@/components/member/MemberElectionsWorkspace";
import MemberEventsActivitiesWorkspace from "@/components/member/MemberEventsActivitiesWorkspace";
import MemberFinanceWorkspace from "@/components/member/MemberFinanceWorkspace";
import MemberMembershipWorkspace from "@/components/member/MemberMembershipWorkspace";
import MemberServicesWorkspace from "@/components/member/MemberServicesWorkspace";

type MemberView =
  | "overview"
  | "profile"
  | "status"
  | "number"
  | "card"
  | "qr"
  | "history"
  | "activation"
  | "renewal"
  | "verification"
  | "finance-overview"
  | "finance-fees"
  | "finance-payment"
  | "finance-history"
  | "finance-balance"
  | "finance-receipts"
  | "finance-statements"
  | "events-overview"
  | "events"
  | "upcoming-events"
  | "upcoming-activities"
  | "activities"
  | "event-registration"
  | "activity-registration"
  | "registrations"
  | "attendance"
  | "event-history"
  | "certificates"
  | "elections-overview"
  | "elections-active"
  | "elections-information"
  | "elections-candidates"
  | "elections-eligibility"
  | "elections-voting"
  | "elections-record"
  | "elections-results"
  | "content-announcements"
  | "content-news"
  | "content-blog"
  | "content-resources"
  | "content-downloads"
  | "communication-overview"
  | "communication-notifications"
  | "communication-messages"
  | "communication-support"
  | "communication-feedback"
  | "communication-preferences"
  | "services-overview"
  | "services-submit"
  | "services-requests"
  | "services-status"
  | "services-help"
  | "account-profile"
  | "account-security"
  | "account-login-history"
  | "account-settings";

type ProtectedDashboardProps = {
  portal: PortalType;
  title: string;
  description: string;
  memberView?: MemberView;
};

type MemberDashboardMember = {
  id: string;
  memberNumber: string;

  category: string;
  constitutionalCategory: string;

  status: string;
  activationStatus: string;

  goodStandingStatus: string;
  financialStatus: string;
  disciplinaryStatus: string;

  registrationNumber: string | null;
  admissionNumber: string | null;
  nationalId: string | null;
  staffNumber: string | null;

  position: string | null;

  yearOfStudy: number | null;
  graduationYear: number | null;

  programme: string | null;
  faculty: string | null;
  department: string | null;

  email: string | null;
  phone: string | null;
  address: string | null;
  county: string | null;

  source: string;

  organization: {
    id: string;
    name: string;
    code: string;
  } | null;

  membershipPeriod: {
    id: string;
    membershipYear: string;
    startsAt: string;
    endsAt: string;
    status: string;
    activatedAt: string | null;
  } | null;
};

type MemberDashboardResponse = {
  portal: "member";
  message?: string;

  user: {
    id: string;
    email: string;
    member?: AuthUser["member"];
    roles?: string[];
    isSystemOwner?: boolean;
  };

  member: MemberDashboardMember | null;
};

type ExecutiveDashboardResponse = {
  portal: "executive";
  message: string;

  user: {
    id: string;
    email: string;
    member?: AuthUser["member"];
    roles?: string[];
    isSystemOwner?: boolean;
  };
};

type AdministrationDashboardResponse = {
  portal: "administration";
  message: string;

  user: {
    id: string;
    email: string;
    member?: AuthUser["member"];
    roles?: string[];
    isSystemOwner?: boolean;
  };
};

type DashboardResponse =
  | MemberDashboardResponse
  | ExecutiveDashboardResponse
  | AdministrationDashboardResponse;

type DashboardErrorResponse = {
  message?: string;
};

const dashboardEndpoints: Record<
  PortalType,
  string
> = {
  member: "/dashboard/member",
  executive: "/dashboard/executive",
  administration: "/dashboard/administration",
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const financeViews = new Set<MemberView>([
  "finance-overview",
  "finance-fees",
  "finance-payment",
  "finance-history",
  "finance-balance",
  "finance-receipts",
  "finance-statements",
]);

const eventsActivitiesViews =
  new Set<MemberView>([
    "events-overview",
    "events",
    "upcoming-events",
    "upcoming-activities",
    "activities",
    "event-registration",
    "activity-registration",
    "registrations",
    "attendance",
    "event-history",
    "certificates",
  ]);

const electionsViews =
  new Set<MemberView>([
    "elections-overview",
    "elections-active",
    "elections-information",
    "elections-candidates",
    "elections-eligibility",
    "elections-voting",
    "elections-record",
    "elections-results",
  ]);

const contentViews =
  new Set<MemberView>([
    "content-announcements",
    "content-news",
    "content-blog",
    "content-resources",
    "content-downloads",
  ]);

const communicationViews =
  new Set<MemberView>([
    "communication-overview",
    "communication-notifications",
    "communication-messages",
    "communication-support",
    "communication-feedback",
    "communication-preferences",
  ]);

const servicesViews =
  new Set<MemberView>([
    "services-overview",
    "services-submit",
    "services-requests",
    "services-status",
    "services-help",
  ]);

const accountViews =
  new Set<MemberView>([
    "account-profile",
    "account-security",
    "account-login-history",
    "account-settings",
  ]);

function statusLabel(status?: string) {
  if (!status) {
    return "Not available";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getFinanceView(
  view: MemberView,
) {
  return view.replace(
    "finance-",
    "",
  ) as
    | "overview"
    | "fees"
    | "payment"
    | "history"
    | "balance"
    | "receipts"
    | "statements";
}

function getEventsActivitiesView(
  view: MemberView,
) {
  if (
    view === "events-overview"
  ) {
    return "overview";
  }

  if (view === "event-history") {
    return "history";
  }

  return view as
    | "events"
    | "activities"
    | "upcoming-events"
    | "upcoming-activities"
    | "event-registration"
    | "activity-registration"
    | "registrations"
    | "attendance"
    | "certificates";
}

function getElectionsView(
  view: MemberView,
) {
  if (
    view === "elections-overview"
  ) {
    return "overview";
  }

  return view.replace(
    "elections-",
    "",
  ) as
    | "active"
    | "information"
    | "candidates"
    | "eligibility"
    | "voting"
    | "record"
    | "results";
}

function getContentView(
  view: MemberView,
) {
  return view.replace(
    "content-",
    "",
  ) as
    | "announcements"
    | "news"
    | "blog"
    | "resources"
    | "downloads";
}

function getCommunicationView(
  view: MemberView,
) {
  return view.replace(
    "communication-",
    "",
  ) as
    | "overview"
    | "notifications"
    | "messages"
    | "support"
    | "feedback"
    | "preferences";
}

function getServicesView(
  view: MemberView,
) {
  return view.replace(
    "services-",
    "",
  ) as
    | "overview"
    | "submit"
    | "requests"
    | "status"
    | "help";
}

function getAccountView(
  view: MemberView,
) {
  return view.replace(
    "account-",
    "",
  ) as
    | "profile"
    | "security"
    | "login-history"
    | "settings";
}

export default function ProtectedDashboard({
  portal,
  title,
  description,
  memberView = "overview",
}: ProtectedDashboardProps) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
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

        const token = getToken();

        if (!token) {
          throw new Error(
            "Your session is no longer available.",
          );
        }

        const response = await fetch(
          `${API_URL}${dashboardEndpoints[portal]}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        const rawData =
          await response.json();

        if (!response.ok) {
          const errorData =
            rawData as DashboardErrorResponse;

          throw new Error(
            errorData.message ??
              "Unable to load your dashboard.",
          );
        }

        const data =
          rawData as DashboardResponse;

        if (
          data.portal !== portal
        ) {
          throw new Error(
            "The dashboard response did not match the requested portal.",
          );
        }

        if (mounted) {
          setUser(authenticatedUser);
          setDashboard(data);
        }
      } catch (dashboardError) {
        if (mounted) {
          setError(
            dashboardError instanceof Error
              ? dashboardError.message
              : "Your session is invalid or the dashboard could not be loaded.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

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
            <div className="h-4 w-28 animate-pulse rounded-full bg-black/5" />

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

  if (
    error ||
    !user ||
    !dashboard
  ) {
    return (
      <main className="min-h-screen bg-[#F6FBFD] px-4 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full overflow-hidden rounded-[2rem] bg-white text-center shadow-xl ring-1 ring-black/5">
            <div className="h-1.5 bg-[#168DB8]" />

            <div className="p-8 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#168DB8]">
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

  const isSystemOwner =
    user.isSystemOwner;

  const member = user.member;

  let workspace: React.ReactNode;

  if (
    portal === "executive" &&
    dashboard.portal === "executive"
  ) {
    workspace = (
      <ExecutiveDashboardWorkspace
        user={user}
        dashboard={dashboard}
      />
    );
  } else if (
    portal === "administration" &&
    dashboard.portal === "administration"
  ) {
    workspace = (
      <ExistingPortalWorkspace
        portal="administration"
        title={title}
        description={description}
        dashboard={dashboard}
        user={user}
        member={member}
        isSystemOwner={
          isSystemOwner
        }
      />
    );
  } else if (
    portal === "member" &&
    dashboard.portal === "member" &&
    memberView === "overview" &&
    title === "Member Dashboard"
  ) {
    workspace = (
      <MemberDashboardWorkspace
        user={user}
        dashboard={dashboard}
      />
    );
  } else if (
    financeViews.has(memberView)
  ) {
    workspace = (
      <MemberFinanceWorkspace
        view={getFinanceView(
          memberView,
        )}
      />
    );
  } else if (
    eventsActivitiesViews.has(
      memberView,
    )
  ) {
    workspace = (
      <MemberEventsActivitiesWorkspace
        view={getEventsActivitiesView(
          memberView,
        )}
      />
    );
  } else if (
    electionsViews.has(memberView)
  ) {
    workspace = (
      <MemberElectionsWorkspace
        view={getElectionsView(
          memberView,
        )}
      />
    );
  } else if (
    contentViews.has(memberView)
  ) {
    workspace = (
      <MemberContentWorkspace
        view={getContentView(
          memberView,
        )}
      />
    );
  } else if (
    communicationViews.has(
      memberView,
    )
  ) {
    workspace = (
      <MemberCommunicationWorkspace
        view={getCommunicationView(
          memberView,
        )}
      />
    );
  } else if (
    servicesViews.has(memberView)
  ) {
    workspace = (
      <MemberServicesWorkspace
        view={getServicesView(
          memberView,
        )}
      />
    );
  } else if (
    accountViews.has(memberView)
  ) {
    workspace = (
      <MemberAccountWorkspace
        view={getAccountView(
          memberView,
        )}
      />
    );
  } else {
    workspace = (
      <MemberMembershipWorkspace
        view={memberView as
          | "overview"
          | "profile"
          | "status"
          | "number"
          | "card"
          | "qr"
          | "history"
          | "activation"
          | "renewal"
          | "verification"}
      />
    );
  }

  return (
    <DashboardShell
      portal={portal}
      user={user}
    >
      {workspace}
    </DashboardShell>
  );
}

function ExistingPortalWorkspace({
  portal,
  title,
  description,
  dashboard,
  user,
  member,
  isSystemOwner,
}: {
  portal: "administration";
  title: string;
  description: string;
  dashboard: AdministrationDashboardResponse;
  user: AuthUser;
  member: AuthUser["member"];
  isSystemOwner: boolean;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="overflow-hidden rounded-[2rem] bg-[#0B2633] shadow-[0_25px_80px_-35px_rgba(11,38,51,0.55)]">
        <div className="relative">
          <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#168DB8]/25 blur-3xl" />

          <div className="absolute bottom-[-5rem] left-[35%] h-56 w-56 rounded-full bg-[#168DB8]/10 blur-3xl" />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#168DB8]" />

              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                Administration Portal
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
              {dashboard.message ||
                description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/[0.08] px-4 py-2 text-xs font-bold text-white/75">
                {isSystemOwner
                  ? "System Owner Access"
                  : "Authenticated Account"}
              </span>

              <span className="rounded-full bg-white/[0.08] px-4 py-2 text-xs font-bold text-white/75">
                KUHRSA
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          label="Account"
          value={user.email}
        />

        <InfoCard
          label="Organization"
          value={
            user.organization?.name ??
            "KUHRSA"
          }
        />

        <InfoCard
          label="Access"
          value={
            isSystemOwner
              ? "System Owner"
              : user.roles
                  .map(
                    (role) =>
                      role.name,
                  )
                  .join(", ")
          }
        />

        <InfoCard
          label="Membership"
          value={
            member
              ? statusLabel(member.status)
              : isSystemOwner
                ? "System Owner"
                : "Not linked"
          }
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <QuickLinks
          title="Administration"
          links={[
            {
              title: "Members",
              href: "/administration/members",
            },
            {
              title: "Users",
              href: "/administration/users",
            },
            {
              title: "Notifications",
              href: "/administration/notifications",
            },
            {
              title: "Departments",
              href: "/administration/departments",
            },
          ]}
        />

        <QuickLinks
          title="Management"
          links={[
            {
              title: "Finance",
              href: "/administration/finance",
            },
            {
              title: "Content",
              href: "/administration/content",
            },
            {
              title: "Reports",
              href: "/administration/reports",
            },
            {
              title: "System",
              href: "/administration/system",
            },
          ]}
        />
      </section>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F7FBFC] p-4 ring-1 ring-black/5">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function QuickLinks({
  title,
  links,
}: {
  title: string;
  links: Array<{
    title: string;
    href: string;
  }>;
}) {
  return (
    <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
        Quick Access
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {title}
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={`${link.title}-${link.href}`}
            href={link.href}
            className="group rounded-2xl border border-black/5 bg-[#F7FBFC] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#0B2633]">
                {link.title}
              </span>

              <span className="text-[#168DB8] transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
