"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getToken,
  logout,
} from "@/lib/auth";

type MembershipView =
  | "dashboard"
  | "students"
  | "alumni"
  | "lecturers"
  | "pending"
  | "active"
  | "expired"
  | "suspended"
  | "activation"
  | "migration"
  | "renewal"
  | "cards"
  | "verification"
  | "requests"
  | "documents"
  | "history";

type Props = {
  view: MembershipView;
};

type MemberCategory =
  | "STUDENT"
  | "ALUMNI"
  | "LECTURER";

type MemberStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "ARCHIVED";

type MemberActivationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "COMPLETED"
  | "EXPIRED";

type Member = {
  id: string;
  organizationId: string;
  category: MemberCategory;
  memberNumber: string | null;
  registrationNumber: string | null;
  admissionNumber: string | null;
  yearOfStudy: number | null;
  graduationYear: number | null;
  programme: string | null;
  faculty: string | null;
  department: string | null;
  position: string | null;
  email: string | null;
  phone: string | null;
  status: MemberStatus;
  activationStatus: MemberActivationStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string;
    status: string;
    isSystemOwner: boolean;
  } | null;
};

type MembershipSummary = {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  inactiveMembers: number;
  suspendedMembers: number;
  archivedMembers: number;

  students: number;
  alumni: number;
  lecturers: number;

  activationPending: number;
  activationCompleted: number;
  activationExpired: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    "",
  ) ?? "http://localhost:3001";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatCategory(
  category: MemberCategory,
) {
  switch (category) {
    case "STUDENT":
      return "Student";

    case "ALUMNI":
      return "Alumni";

    case "LECTURER":
      return "Lecturer";
  }
}

function getMemberName(
  member: Member,
) {
  const name = [
    member.user?.firstName,
    member.user?.middleName,
    member.user?.lastName,
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value?.trim()),
    )
    .join(" ")
    .trim();

  return name || "Name not available";
}

function getMemberNumber(
  member: Member,
) {
  return (
    member.memberNumber ??
    member.registrationNumber ??
    member.admissionNumber ??
    "Not assigned"
  );
}

function statusClasses(
  status: MemberStatus,
) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";

    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-600/10";

    case "SUSPENDED":
      return "bg-rose-50 text-rose-700 ring-rose-600/10";

    case "INACTIVE":
      return "bg-slate-100 text-slate-600 ring-slate-500/10";

    case "ARCHIVED":
      return "bg-zinc-100 text-zinc-600 ring-zinc-500/10";

    default:
      return "bg-slate-100 text-slate-600 ring-slate-500/10";
  }
}

async function apiRequest<T>(
  path: string,
): Promise<T> {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (response.status === 401) {
    logout();

    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  if (!response.ok) {
    const message = Array.isArray(
      data?.message,
    )
      ? data.message.join(", ")
      : data?.message;

    throw new Error(
      message ||
        "The request could not be completed.",
    );
  }

  return data as T;
}

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#CE26A4]">
        Membership
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">
        {title}
      </h1>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">
        {description}
      </p>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_20px_rgba(11,38,51,0.03)]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  value,
}: {
  value: string;
}) {
  const positive =
    value === "Active" ||
    value === "Resolved" ||
    value === "Issued";

  const warning =
    value === "Pending" ||
    value === "Pending Review" ||
    value === "Review" ||
    value === "Open" ||
    value === "Documents Required";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : warning
            ? "bg-[#CE26A4]/10 text-[#CE26A4]"
            : "bg-black/[0.05] text-black/50"
      }`}
    >
      {value}
    </span>
  );
}

function LoadingState() {
  return (
    <section className="rounded-3xl bg-white p-8 text-center ring-1 ring-black/[0.06]">
      <p className="text-sm font-bold text-[#0B2633]">
        Loading membership data…
      </p>

      <p className="mt-1 text-xs text-black/40">
        Retrieving current records from the KUHRSA system.
      </p>
    </section>
  );
}

function EmptyState({
  title = "No membership records",
  description = "There are currently no records available for this view.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-8 text-center ring-1 ring-black/[0.06]">
      <p className="text-sm font-black text-[#0B2633]">
        {title}
      </p>

      <p className="mt-1 text-xs text-black/40">
        {description}
      </p>
    </section>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
      <p className="text-sm font-black text-rose-800">
        Unable to load membership data
      </p>

      <p className="mt-1 text-sm text-rose-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
      >
        Retry
      </button>
    </section>
  );
}

function MemberTable({
  title,
  data,
}: {
  title: string;
  data: Member[];
}) {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2633]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Live membership records from the KUHRSA system.
          </p>
        </div>

        <Link
          href="/administration/membership/verification"
          className="rounded-xl border border-black/[0.08] px-4 py-2 text-xs font-black text-[#0B2633] transition hover:bg-[#F8FBFC]"
        >
          Verify
        </Link>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {[
                  "Member",
                  "Member Number",
                  "Category",
                  "Status",
                  "Activation",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 first:pl-0">
                    <p className="text-sm font-black text-[#0B2633]">
                      {getMemberName(item)}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {item.email ??
                        item.user?.email ??
                        "Email not available"}
                    </p>
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/55">
                    {getMemberNumber(item)}
                  </td>

                  <td className="px-3 py-4 text-xs font-semibold text-black/55">
                    {formatCategory(item.category)}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${statusClasses(item.status)}`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <StatusBadge
                      value={formatStatus(
                        item.activationStatus,
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function useMembershipData() {
  const [summary, setSummary] =
    useState<MembershipSummary | null>(
      null,
    );

  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          membershipSummary,
          memberRecords,
        ] = await Promise.all([
          apiRequest<MembershipSummary>(
            "/dashboard/administration/membership-summary",
          ),
          apiRequest<Member[]>(
            "/members",
          ),
        ]);

        setSummary(
          membershipSummary,
        );

        setMembers(
          memberRecords,
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load membership data.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    summary,
    members,
    loading,
    error,
    retry: load,
  };
}

function DashboardView() {
  const {
    summary,
    members,
    loading,
    error,
    retry,
  } = useMembershipData();

  const recentMembers =
    useMemo(
      () =>
        [...members]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime(),
          )
          .slice(0, 5),
      [members],
    );

  return (
    <div className="space-y-6">
      <Header
        title="Membership Dashboard"
        description="Administrative oversight of member records, categories, activation, renewal and membership lifecycle."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={retry}
        />
      ) : summary ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Total Members"
              value={summary.totalMembers}
            />

            <StatCard
              label="Students"
              value={summary.students}
            />

            <StatCard
              label="Alumni"
              value={summary.alumni}
            />

            <StatCard
              label="Lecturers"
              value={summary.lecturers}
            />

            <StatCard
              label="Pending Members"
              value={summary.pendingMembers}
            />

            <StatCard
              label="Active Members"
              value={summary.activeMembers}
            />
          </section>

          <MemberTable
            title="Recent Membership Records"
            data={recentMembers}
          />

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
              <h2 className="text-lg font-black text-[#0B2633]">
                Membership Lifecycle
              </h2>

              <div className="mt-5 space-y-3">
                {[
                  [
                    "Applications",
                    `${summary.pendingMembers} pending`,
                  ],
                  [
                    "Activation",
                    `${summary.activationPending} pending`,
                  ],
                  [
                    "Activation Completed",
                    `${summary.activationCompleted} completed`,
                  ],
                  [
                    "Activation Expired",
                    `${summary.activationExpired} expired`,
                  ],
                ].map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl bg-[#F8FBFC] px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-black/55">
                        {label}
                      </span>

                      <span className="text-sm font-black text-[#0B2633]">
                        {value}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
              <h2 className="text-lg font-black text-[#0B2633]">
                Quick Access
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "All Members",
                    "/administration/members",
                  ],
                  [
                    "Pending Applications",
                    "/administration/membership/pending",
                  ],
                  [
                    "Activation",
                    "/administration/membership/activation",
                  ],
                  [
                    "Renewal",
                    "/administration/membership/renewal",
                  ],
                ].map(
                  ([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="rounded-2xl border border-black/[0.06] bg-[#F8FBFC] px-4 py-4 text-sm font-bold text-[#0B2633] transition hover:border-[#CE26A4]/20 hover:bg-[#FFF7FC]"
                    >
                      {label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          title="Membership summary unavailable"
          description="The system returned no membership summary."
        />
      )}
    </div>
  );
}

function CategoryView({
  title,
  description,
  category,
}: {
  title: string;
  description: string;
  category: MemberCategory;
}) {
  const {
    summary,
    members,
    loading,
    error,
    retry,
  } = useMembershipData();

  const filtered = useMemo(
    () =>
      members.filter(
        (item) =>
          item.category === category,
      ),
    [members, category],
  );

  const categoryCount =
    category === "STUDENT"
      ? summary?.students ?? 0
      : category === "ALUMNI"
        ? summary?.alumni ?? 0
        : summary?.lecturers ?? 0;

  const activeCount =
    filtered.filter(
      (item) =>
        item.status === "ACTIVE",
    ).length;

  const pendingCount =
    filtered.filter(
      (item) =>
        item.status === "PENDING",
    ).length;

  return (
    <div className="space-y-6">
      <Header
        title={title}
        description={description}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={retry}
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Category Members"
              value={categoryCount}
            />

            <StatCard
              label="Active"
              value={activeCount}
            />

            <StatCard
              label="Pending"
              value={pendingCount}
            />

            <StatCard
              label="Current Records"
              value={filtered.length}
            />
          </section>

          <MemberTable
            title={`${formatCategory(category)} Members`}
            data={filtered}
          />
        </>
      )}
    </div>
  );
}

function StatusView({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: MemberStatus;
}) {
  const {
    members,
    loading,
    error,
    retry,
  } = useMembershipData();

  const filtered = useMemo(
    () =>
      members.filter(
        (item) =>
          item.status === status,
      ),
    [members, status],
  );

  return (
    <div className="space-y-6">
      <Header
        title={title}
        description={description}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={retry}
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Records"
              value={filtered.length}
            />

            <StatCard
              label="Current Records"
              value={filtered.length}
            />

            <StatCard
              label="Requiring Review"
              value={
                status === "PENDING" ||
                status === "SUSPENDED"
                  ? filtered.length
                  : 0
              }
            />
          </section>

          <MemberTable
            title={`${formatStatus(status)} Members`}
            data={filtered}
          />
        </>
      )}
    </div>
  );
}

function PendingView() {
  const {
    members,
    loading,
    error,
    retry,
  } = useMembershipData();

  const pendingMembers =
    useMemo(
      () =>
        members.filter(
          (item) =>
            item.status === "PENDING",
        ),
      [members],
    );

  return (
    <div className="space-y-6">
      <Header
        title="Pending Applications"
        description="Review applications that are waiting for membership approval or additional information."
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={retry}
        />
      ) : pendingMembers.length ===
        0 ? (
        <EmptyState
          title="No pending applications"
          description="There are currently no members awaiting approval."
        />
      ) : (
        <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div className="space-y-3">
            {pendingMembers.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl bg-[#F8FBFC] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-black text-[#0B2633]">
                      {getMemberName(item)}
                    </p>

                    <p className="mt-1 text-xs text-black/45">
                      {formatCategory(
                        item.category,
                      )}{" "}
                      •{" "}
                      {getMemberNumber(
                        item,
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge value="Pending" />

                    <Link
                      href={`/administration/members?member=${item.id}`}
                      className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function OperationalView({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="space-y-6">
      <Header
        title={title}
        description={description}
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="space-y-3">
          {items.map(
            (item, index) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-black/[0.05] p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#CE26A4]/10 text-xs font-black text-[#CE26A4]">
                  {index + 1}
                </span>

                <div>
                  <p className="text-sm font-black text-[#0B2633]">
                    {item}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    Development placeholder • Backend integration pending
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function RequestsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Member Requests"
        description="Manage requests submitted by members and route them to the appropriate administrative process."
      />

      <EmptyState
        title="No member requests available"
        description="Request records will appear here once the requests workflow is connected to the backend."
      />
    </div>
  );
}

function HistoryView() {
  return (
    <div className="space-y-6">
      <Header
        title="Membership History"
        description="Historical membership lifecycle activity and administrative changes."
      />

      <EmptyState
        title="Membership history is not connected yet"
        description="Historical lifecycle records will appear here once the history endpoint is connected."
      />
    </div>
  );
}

export default function AdministrationMembershipWorkspace({
  view,
}: Props) {
  switch (view) {
    case "students":
      return (
        <CategoryView
          title="Students"
          description="Manage the student membership population."
          category="STUDENT"
        />
      );

    case "alumni":
      return (
        <CategoryView
          title="Alumni"
          description="Manage alumni membership records and status."
          category="ALUMNI"
        />
      );

    case "lecturers":
      return (
        <CategoryView
          title="Lecturers"
          description="Manage lecturer membership records."
          category="LECTURER"
        />
      );

    case "pending":
      return <PendingView />;

    case "active":
      return (
        <StatusView
          title="Active Members"
          description="View members with an active membership status."
          status="ACTIVE"
        />
      );

    case "expired":
      return (
        <StatusView
          title="Expired Members"
          description="Review members whose current membership period has expired."
          status="INACTIVE"
        />
      );

    case "suspended":
      return (
        <StatusView
          title="Suspended Members"
          description="Review members whose membership access is currently suspended."
          status="SUSPENDED"
        />
      );

    case "activation":
      return (
        <OperationalView
          title="Membership Activation"
          description="Process eligible member activation workflows."
          items={[
            "Pending activation queue",
            "Activation eligibility checks",
            "Manual activation review",
            "Activation history",
          ]}
        />
      );

    case "migration":
      return (
        <OperationalView
          title="Membership Migration"
          description="Manage migration of legacy association records into the KUHRSA membership system."
          items={[
            "Migration batches",
            "Legacy member matching",
            "Duplicate detection",
            "Migration validation",
          ]}
        />
      );

    case "renewal":
      return (
        <OperationalView
          title="Membership Renewal"
          description="Manage upcoming and current membership renewal workflows."
          items={[
            "Renewal queue",
            "Renewal eligibility",
            "Renewal status",
            "Renewal history",
          ]}
        />
      );

    case "cards":
      return (
        <OperationalView
          title="Membership Cards"
          description="Manage digital membership card issuance and lifecycle."
          items={[
            "Cards issued",
            "Cards pending",
            "Card replacement requests",
            "Card verification",
          ]}
        />
      );

    case "verification":
      return (
        <OperationalView
          title="Member Verification"
          description="Verify membership identity and current membership status."
          items={[
            "Member number lookup",
            "Membership status verification",
            "QR verification",
            "Verification history",
          ]}
        />
      );

    case "requests":
      return <RequestsView />;

    case "documents":
      return (
        <OperationalView
          title="Member Documents"
          description="Review and manage documents associated with membership records."
          items={[
            "Submitted documents",
            "Documents requiring review",
            "Verified documents",
            "Document categories",
          ]}
        />
      );

    case "history":
      return <HistoryView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
