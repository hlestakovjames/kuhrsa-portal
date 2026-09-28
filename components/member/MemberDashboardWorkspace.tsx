"use client";

import Link from "next/link";

import type { AuthUser } from "@/lib/auth";

type MemberDashboard = {
  portal: "member";

  user: {
    id: string;
    email?: string;
  };

  member: {
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
  } | null;
};

type MemberDashboardWorkspaceProps = {
  user: AuthUser;
  dashboard: MemberDashboard;
};

function displayName(user: AuthUser) {
  const parts = [
    user.firstName,
    user.middleName,
    user.lastName,
  ].filter(
    (value): value is string =>
      Boolean(value?.trim()),
  );

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return "Member";
}

function statusLabel(
  status?: string | null,
) {
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

function valueOrUnavailable(
  value?: string | number | null,
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  return String(value);
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-KE",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
}

function categoryLabel(
  category?: string | null,
) {
  return statusLabel(category);
}

function StatIcon({
  type,
}: {
  type:
    | "membership"
    | "finance"
    | "events"
    | "activities"
    | "attendance"
    | "notifications";
}) {
  const classes = "h-5 w-5";

  switch (type) {
    case "membership":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c.8-3.5 3.1-5.5 7-5.5s6.2 2 7 5.5" />
        </svg>
      );

    case "finance":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="M3 10h18M7 15h4" />
        </svg>
      );

    case "events":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
          />
          <path d="M7 3v4M17 3v4M3 10h18" />
        </svg>
      );

    case "activities":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 17.5 9 12l3 3 8-9" />
          <path d="M16 6h4v4M4 21h16" />
        </svg>
      );

    case "attendance":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "notifications":
      return (
        <svg
          className={classes}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );
  }
}

function StatCard({
  title,
  value,
  subtitle,
  href,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  href: string;
  icon:
    | "membership"
    | "finance"
    | "events"
    | "activities"
    | "attendance"
    | "notifications";
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)] transition hover:-translate-y-0.5 hover:border-[#168DB8]/25 hover:shadow-[0_14px_40px_rgba(11,38,51,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#168DB8]/10 text-[#168DB8]">
          <StatIcon type={icon} />
        </div>

        <svg
          className="h-4 w-4 text-black/20 transition group-hover:translate-x-0.5 group-hover:text-[#168DB8]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </div>

      <p className="mt-4 text-xs font-black uppercase tracking-[0.13em] text-black/35">
        {title}
      </p>

      <p className="mt-2 break-words text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-black/45">
        {subtitle}
      </p>
    </Link>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/[0.05] bg-[#F8FBFC] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-bold text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

export default function MemberDashboardWorkspace({
  user,
  dashboard,
}: MemberDashboardWorkspaceProps) {
  const member = dashboard.member;
  const name = displayName(user);

  if (!member) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-3xl bg-[#0B2633] px-6 py-8 text-white shadow-[0_18px_50px_rgba(11,38,51,0.14)] sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300/80">
            Member Portal
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Welcome, {name}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Your KUHRSA account is authenticated,
            but it is not currently linked to a
            membership record.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-black text-amber-900">
            Membership record unavailable
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            Please contact KUHRSA administration
            if you believe your membership should
            already be linked to this account.
          </p>
        </section>
      </div>
    );
  }

  const membershipPeriod =
    member.membershipPeriod;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="relative overflow-hidden rounded-3xl bg-[#0B2633] px-6 py-7 text-white shadow-[0_18px_50px_rgba(11,38,51,0.14)] sm:px-8 sm:py-8">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#168DB8]/20 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300/80">
            Member Portal
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Welcome, {name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Your KUHRSA membership information,
                status, and member services are shown
                below using your current account record.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
                Membership
              </p>

              <p className="mt-1 text-sm font-black">
                {categoryLabel(member.category)} Member
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    member.status === "ACTIVE"
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }`}
                />

                <span
                  className={`text-xs font-semibold ${
                    member.status === "ACTIVE"
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }`}
                >
                  {statusLabel(member.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          title="Membership"
          value={statusLabel(member.status)}
          subtitle={statusLabel(member.activationStatus)}
          href="/dashboard/membership"
          icon="membership"
        />

        <StatCard
          title="Finance"
          value={statusLabel(member.financialStatus)}
          subtitle="Current financial status"
          href="/dashboard/finance"
          icon="finance"
        />

        <StatCard
          title="Upcoming Events"
          value="Not available"
          subtitle="No event data connected yet"
          href="/dashboard/events/upcoming"
          icon="events"
        />

        <StatCard
          title="Activities"
          value="Not available"
          subtitle="No activity data connected yet"
          href="/dashboard/activities"
          icon="activities"
        />

        <StatCard
          title="Attendance"
          value="Not available"
          subtitle="No attendance data connected yet"
          href="/dashboard/events/attendance"
          icon="attendance"
        />

        <StatCard
          title="Notifications"
          value="Not available"
          subtitle="No notification summary connected yet"
          href="/dashboard/communication/notifications"
          icon="notifications"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Membership
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-[#0B2633]">
                Membership Information
              </h2>
            </div>

            <Link
              href="/dashboard/membership/profile"
              className="text-xs font-black text-[#168DB8] hover:underline"
            >
              View Profile
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailRow
              label="Member Number"
              value={member.memberNumber}
            />

            <DetailRow
              label="Category"
              value={categoryLabel(member.category)}
            />

            <DetailRow
              label="Membership Status"
              value={statusLabel(member.status)}
            />

            <DetailRow
              label="Activation Status"
              value={statusLabel(
                member.activationStatus,
              )}
            />

            <DetailRow
              label="Good Standing"
              value={statusLabel(
                member.goodStandingStatus,
              )}
            />

            <DetailRow
              label="Financial Status"
              value={statusLabel(
                member.financialStatus,
              )}
            />

            <DetailRow
              label="Disciplinary Status"
              value={statusLabel(
                member.disciplinaryStatus,
              )}
            />

            <DetailRow
              label="Constitutional Category"
              value={statusLabel(
                member.constitutionalCategory,
              )}
            />
          </div>

          {membershipPeriod && (
            <div className="mt-4 rounded-2xl bg-[#0B2633] p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
                Membership Period
              </p>

              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-white/40">
                    Membership Year
                  </p>

                  <p className="mt-1 text-sm font-black">
                    {membershipPeriod.membershipYear}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Starts
                  </p>

                  <p className="mt-1 text-sm font-black">
                    {formatDate(
                      membershipPeriod.startsAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-white/40">
                    Ends
                  </p>

                  <p className="mt-1 text-sm font-black">
                    {formatDate(
                      membershipPeriod.endsAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!membershipPeriod && (
            <div className="mt-4 rounded-2xl border border-black/[0.05] bg-[#F8FBFC] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
                Membership Period
              </p>

              <p className="mt-2 text-sm font-bold text-[#0B2633]">
                Not available
              </p>

              <p className="mt-1 text-xs leading-5 text-black/45">
                No membership period is currently linked
                to this member record.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
            Member Identity
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-[#0B2633]">
            Your Details
          </h2>

          <div className="mt-5 space-y-3">
            <DetailRow
              label="Registration Number"
              value={valueOrUnavailable(
                member.registrationNumber,
              )}
            />

            <DetailRow
              label="Admission Number"
              value={valueOrUnavailable(
                member.admissionNumber,
              )}
            />

            <DetailRow
              label="National ID"
              value={valueOrUnavailable(
                member.nationalId,
              )}
            />

            <DetailRow
              label="Staff Number"
              value={valueOrUnavailable(
                member.staffNumber,
              )}
            />

            <DetailRow
              label="Source"
              value={statusLabel(member.source)}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
            Academic & Professional
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-[#0B2633]">
            Member Information
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailRow
              label="Programme"
              value={valueOrUnavailable(
                member.programme,
              )}
            />

            <DetailRow
              label="Faculty / School"
              value={valueOrUnavailable(
                member.faculty,
              )}
            />

            <DetailRow
              label="Department"
              value={valueOrUnavailable(
                member.department,
              )}
            />

            <DetailRow
              label="Year of Study"
              value={valueOrUnavailable(
                member.yearOfStudy,
              )}
            />

            <DetailRow
              label="Graduation Year"
              value={valueOrUnavailable(
                member.graduationYear,
              )}
            />

            <DetailRow
              label="Position"
              value={valueOrUnavailable(
                member.position,
              )}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
            Contact
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-[#0B2633]">
            Contact Information
          </h2>

          <div className="mt-5 space-y-3">
            <DetailRow
              label="Email"
              value={valueOrUnavailable(
                member.email ?? user.email,
              )}
            />

            <DetailRow
              label="Phone"
              value={valueOrUnavailable(
                member.phone,
              )}
            />

            <DetailRow
              label="Address"
              value={valueOrUnavailable(
                member.address,
              )}
            />

            <DetailRow
              label="County"
              value={valueOrUnavailable(
                member.county,
              )}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Workspace
            </p>

            <h2 className="mt-1 text-xl font-black text-[#0B2633]">
              Common Actions
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/membership/profile"
            className="rounded-xl border border-black/[0.05] px-4 py-3 text-sm font-bold text-[#0B2633] transition hover:border-[#168DB8]/20 hover:bg-[#168DB8]/5"
          >
            View Membership Profile
          </Link>

          <Link
            href="/dashboard/membership/card"
            className="rounded-xl border border-black/[0.05] px-4 py-3 text-sm font-bold text-[#0B2633] transition hover:border-[#168DB8]/20 hover:bg-[#168DB8]/5"
          >
            Membership Card
          </Link>

          <Link
            href="/dashboard/finance"
            className="rounded-xl border border-black/[0.05] px-4 py-3 text-sm font-bold text-[#0B2633] transition hover:border-[#168DB8]/20 hover:bg-[#168DB8]/5"
          >
            Finance
          </Link>

          <Link
            href="/dashboard/events"
            className="rounded-xl border border-black/[0.05] px-4 py-3 text-sm font-bold text-[#0B2633] transition hover:border-[#168DB8]/20 hover:bg-[#168DB8]/5"
          >
            Events & Activities
          </Link>
        </div>
      </section>
    </div>
  );
}
