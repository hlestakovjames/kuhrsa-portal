"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  getToken,
  logout,
} from "@/lib/auth";

type ReportsView =
  | "dashboard"
  | "membership"
  | "finance"
  | "payments"
  | "events"
  | "activities"
  | "elections"
  | "communication"
  | "analytics"
  | "custom";

type Props = {
  view: ReportsView;
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

type FinanceSummary = {
  outstandingBalance: string;
  completedPaymentsAmount: string;
  overdueCharges: number;
  pendingPayments: number;
  failedPayments: number;
  cancelledPayments: number;
};

type UsersSummary = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  lockedUsers: number;
};

type NotificationSummary = {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  cancelled: number;
};

type AdministrationDashboard = {
  portal: "administration";
  membership: MembershipSummary;
  users: UsersSummary;
  governance: {
    totalPositions: number;
    activePositions: number;
    totalAssignments: number;
    activeAssignments: number;
    pendingAssignments: number;
    activeTerms: number;
  };
  finance: FinanceSummary;
  notifications: NotificationSummary;
  audit: {
    recent: unknown[];
  };
  alerts: Array<{
    level: string;
    key: string;
    title: string;
    detail: string;
    count: number;
  }>;
  availability: {
    events: boolean;
    activities: boolean;
    requests: boolean;
    analytics: boolean;
  };
};

type Member = {
  id: string;
  category: "STUDENT" | "ALUMNI" | "LECTURER";
  status:
    | "ACTIVE"
    | "PENDING"
    | "INACTIVE"
    | "SUSPENDED"
    | "ARCHIVED";
  activationStatus:
    | "PENDING"
    | "COMPLETED"
    | "EXPIRED"
    | string;
  memberNumber: string | null;
  registrationNumber: string | null;
  admissionNumber: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    "",
  ) ?? "http://localhost:3001";

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

async function downloadFile(
  path: string,
  fallbackName: string,
) {
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

  if (response.status === 401) {
    logout();

    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    const message = Array.isArray(
      data?.message,
    )
      ? data.message.join(", ")
      : data?.message;

    throw new Error(
      message ||
        "The file could not be downloaded.",
    );
  }

  const disposition =
    response.headers.get(
      "Content-Disposition",
    );

  let fileName = fallbackName;

  const fileNameMatch =
    disposition?.match(
      /filename="([^"]+)"/i,
    );

  if (fileNameMatch?.[1]) {
    fileName = fileNameMatch[1];
  }

  const blob =
    await response.blob();

  const url =
    window.URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  anchor.remove();

  window.URL.revokeObjectURL(
    url,
  );
}

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

function formatCurrency(
  value: string | number,
) {
  const numericValue =
    Number(value);

  if (!Number.isFinite(numericValue)) {
    return "KSh 0.00";
  }

  return new Intl.NumberFormat(
    "en-KE",
    {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(numericValue);
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    "en-KE",
    {
      dateStyle: "medium",
    },
  ).format(date);
}

function percentage(
  value: number,
  total: number,
) {
  if (!total) {
    return "0.0%";
  }

  return `${(
    (value / total) *
    100
  ).toFixed(1)}%`;
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

  return (
    name ||
    member.memberNumber ||
    member.registrationNumber ||
    member.admissionNumber ||
    "Name not available"
  );
}

function formatCategory(
  category: string,
) {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatStatus(
  status: string,
) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
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
        Reports & Analytics
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
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-rose-700">
        Unable to load report
      </p>

      <p className="mt-2 text-sm leading-6 text-rose-800">
        {message}
      </p>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
        >
          Try Again
        </button>
      ) : null}
    </section>
  );
}

function EmptyState({
  title = "No records available",
  description = "There is currently no data available for this report.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-8 text-center ring-1 ring-black/[0.06]">
      <p className="text-sm font-black text-[#0B2633]">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/40">
        {description}
      </p>
    </section>
  );
}

function NotConnectedState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
        Reporting data not connected
      </p>

      <h2 className="mt-2 text-lg font-black text-[#0B2633]">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-900/70">
        {description}
      </p>
    </section>
  );
}

function DownloadButton({
  label,
  onClick,
  loading,
}: {
  label: string;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-xl bg-[#0B2633] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#173B4B] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Preparing..."
        : label}
    </button>
  );
}

function ExportPanel({
  title = "Export records",
  description = "Download the records available for this report.",
  exports,
}: {
  title?: string;
  description?: string;
  exports: Array<{
    label: string;
    path: string;
    fileName: string;
  }>;
}) {
  const [loading, setLoading] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function handleDownload(
    item: {
      label: string;
      path: string;
      fileName: string;
    },
  ) {
    setError(null);
    setLoading(item.label);

    try {
      await downloadFile(
        item.path,
        item.fileName,
      );
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "The file could not be downloaded.",
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div>
        <h2 className="text-lg font-black text-[#0B2633]">
          {title}
        </h2>

        <p className="mt-1 text-sm text-black/40">
          {description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {exports.map((item) => (
          <DownloadButton
            key={item.label}
            label={item.label}
            loading={
              loading === item.label
            }
            onClick={() =>
              handleDownload(item)
            }
          />
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function ReportTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<
    Array<string | number>
  >;
}) {
  if (!rows.length) {
    return <EmptyState />;
  }

  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {headers.map(
                (header) => (
                  <th
                    key={header}
                    className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map(
              (
                row,
                index,
              ) => (
                <tr
                  key={`${row[0]}-${index}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  {row.map(
                    (
                      cell,
                      cellIndex,
                    ) => (
                      <td
                        key={`${cell}-${cellIndex}`}
                        className="px-3 py-4 text-sm font-semibold text-black/55 first:pl-0"
                      >
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function useAdministrationDashboard() {
  const [
    dashboard,
    setDashboard,
  ] =
    useState<AdministrationDashboard | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const data =
          await apiRequest<AdministrationDashboard>(
            "/dashboard/administration",
          );

        setDashboard(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The administration report data could not be loaded.",
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
    dashboard,
    loading,
    error,
    reload: load,
  };
}

function useMembers() {
  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const data =
          await apiRequest<Member[]>(
            "/members",
          );

        setMembers(
          Array.isArray(data)
            ? data
            : [],
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The membership records could not be loaded.",
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
    members,
    loading,
    error,
    reload: load,
  };
}

function DashboardView() {
  const {
    dashboard,
    loading,
    error,
    reload,
  } =
    useAdministrationDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          title="Reports & Analytics"
          description="Central reporting workspace across the KUHRSA management system."
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.06]"
              />
            ),
          )}
        </section>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <Header
          title="Reports & Analytics"
          description="Central reporting workspace across the KUHRSA management system."
        />

        <ErrorState
          message={
            error ??
            "The report dashboard could not be loaded."
          }
          onRetry={reload}
        />
      </div>
    );
  }

  const membership =
    dashboard.membership;

  const finance =
    dashboard.finance;

  const unavailableAreas =
    [
      !dashboard.availability.events
        ? "Events"
        : null,
      !dashboard.availability.activities
        ? "Activities"
        : null,
      !dashboard.availability.analytics
        ? "Analytics"
        : null,
    ].filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    );

  const reportCards = [
    {
      title: "Membership Reports",
      description:
        "Membership population, category, status and lifecycle reporting.",
      href: "/administration/reports/membership",
      value:
        formatNumber(
          membership.totalMembers,
        ),
      metric: "members",
    },
    {
      title: "Finance Reports",
      description:
        "Completed payment collections and outstanding member balances.",
      href: "/administration/reports/finance",
      value:
        formatCurrency(
          finance.completedPaymentsAmount,
        ),
      metric: "completed payments",
    },
    {
      title: "Payment Reports",
      description:
        "Payment amounts and outstanding transaction states.",
      href: "/administration/reports/payments",
      value:
        formatCurrency(
          finance.completedPaymentsAmount,
        ),
      metric: "completed payments",
    },
    {
      title: "Event Reports",
      description:
        "Event registration, attendance and participation reporting.",
      href: "/administration/reports/events",
      value:
        dashboard.availability.events
          ? "Available"
          : "Not connected",
      metric: "backend data",
    },
    {
      title: "Activity Reports",
      description:
        "Activity participation and programme performance.",
      href: "/administration/reports/activities",
      value:
        dashboard.availability
          .activities
          ? "Available"
          : "Not connected",
      metric: "backend data",
    },
    {
      title: "Election Reports",
      description:
        "Election cycles, participation, candidates and results.",
      href: "/administration/reports/elections",
      value: "Not connected",
      metric: "backend data",
    },
    {
      title: "Communication Reports",
      description:
        "Notification delivery and communication performance.",
      href: "/administration/reports/communication",
      value:
        formatNumber(
          dashboard.notifications.total,
        ),
      metric: "notifications",
    },
    {
      title: "Membership Analytics",
      description:
        "Membership trends and intelligence from connected data.",
      href: "/administration/reports/analytics",
      value:
        dashboard.availability.analytics
          ? "Available"
          : "Not connected",
      metric: "backend data",
    },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Reports & Analytics"
        description="Central reporting workspace across the KUHRSA management system, using connected organizational data."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Members"
          value={formatNumber(
            membership.totalMembers,
          )}
        />

        <StatCard
          label="Completed Payments"
          value={formatCurrency(
            finance.completedPaymentsAmount,
          )}
        />

        <StatCard
          label="Outstanding Balance"
          value={formatCurrency(
            finance.outstandingBalance,
          )}
        />

        <StatCard
          label="Overdue Charges"
          value={formatNumber(
            finance.overdueCharges,
          )}
        />
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-black text-[#0B2633]">
            Reporting Areas
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Select a report family to inspect connected data or available exports.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportCards.map(
            (report) => (
              <Link
                key={report.href}
                href={report.href}
                className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.06] transition hover:-translate-y-0.5 hover:bg-[#FFF7FC]"
              >
                <p className="text-sm font-black text-[#0B2633]">
                  {report.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-black/45">
                  {report.description}
                </p>

                <p className="mt-5 text-2xl font-black tracking-tight text-[#CE26A4]">
                  {report.value}
                </p>

                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-black/30">
                  {report.metric}
                </p>
              </Link>
            ),
          )}
        </div>
      </section>

      {unavailableAreas.length ? (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
            Connected data coverage
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-900/70">
            {unavailableAreas.join(
              ", ",
            )} reporting currently has no connected backend reporting dataset. The workspace does not display placeholder figures for these areas.
          </p>
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black text-[#0B2633]">
              Custom Reporting
            </h2>

            <p className="mt-1 text-sm text-black/40">
              Configurable report queries are not connected to the backend yet.
            </p>
          </div>

          <Link
            href="/administration/reports/custom"
            className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
          >
            Open Report Builder
          </Link>
        </div>
      </section>
    </div>
  );
}

function MembershipReportView() {
  const {
    dashboard,
    loading: dashboardLoading,
    error: dashboardError,
    reload: reloadDashboard,
  } =
    useAdministrationDashboard();

  const {
    members,
    loading: membersLoading,
    error: membersError,
    reload: reloadMembers,
  } = useMembers();

  const loading =
    dashboardLoading ||
    membersLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          title="Membership Reports"
          description="Membership population, categories, status and lifecycle reporting."
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.06]"
              />
            ),
          )}
        </section>
      </div>
    );
  }

  if (
    dashboardError ||
    membersError ||
    !dashboard
  ) {
    return (
      <div className="space-y-6">
        <Header
          title="Membership Reports"
          description="Membership population, categories, status and lifecycle reporting."
        />

        <ErrorState
          message={
            dashboardError ??
            membersError ??
            "The membership report could not be loaded."
          }
          onRetry={() => {
            void reloadDashboard();
            void reloadMembers();
          }}
        />
      </div>
    );
  }

  const membership =
    dashboard.membership;

  const categoryRows = [
    [
      "Students",
      formatNumber(
        membership.students,
      ),
      percentage(
        membership.students,
        membership.totalMembers,
      ),
    ],
    [
      "Alumni",
      formatNumber(
        membership.alumni,
      ),
      percentage(
        membership.alumni,
        membership.totalMembers,
      ),
    ],
    [
      "Lecturers",
      formatNumber(
        membership.lecturers,
      ),
      percentage(
        membership.lecturers,
        membership.totalMembers,
      ),
    ],
  ];

  const statusRows = [
    [
      "Active Members",
      formatNumber(
        membership.activeMembers,
      ),
      percentage(
        membership.activeMembers,
        membership.totalMembers,
      ),
    ],
    [
      "Pending Members",
      formatNumber(
        membership.pendingMembers,
      ),
      percentage(
        membership.pendingMembers,
        membership.totalMembers,
      ),
    ],
    [
      "Inactive Members",
      formatNumber(
        membership.inactiveMembers,
      ),
      percentage(
        membership.inactiveMembers,
        membership.totalMembers,
      ),
    ],
    [
      "Suspended Members",
      formatNumber(
        membership.suspendedMembers,
      ),
      percentage(
        membership.suspendedMembers,
        membership.totalMembers,
      ),
    ],
    [
      "Archived Members",
      formatNumber(
        membership.archivedMembers,
      ),
      percentage(
        membership.archivedMembers,
        membership.totalMembers,
      ),
    ],
  ];

  const activationRows = [
    [
      "Activation Pending",
      formatNumber(
        membership.activationPending,
      ),
    ],
    [
      "Activation Completed",
      formatNumber(
        membership.activationCompleted,
      ),
    ],
    [
      "Activation Expired",
      formatNumber(
        membership.activationExpired,
      ),
    ],
  ];

  const recentMembers =
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
      .slice(0, 10);

  return (
    <div className="space-y-6">
      <Header
        title="Membership Reports"
        description="Membership population, categories, status and activation lifecycle reporting from connected KUHRSA records."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Members"
          value={formatNumber(
            membership.totalMembers,
          )}
        />

        <StatCard
          label="Active"
          value={formatNumber(
            membership.activeMembers,
          )}
        />

        <StatCard
          label="Pending"
          value={formatNumber(
            membership.pendingMembers,
          )}
        />

        <StatCard
          label="Suspended"
          value={formatNumber(
            membership.suspendedMembers,
          )}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ReportTable
          headers={[
            "Category",
            "Members",
            "Share",
          ]}
          rows={categoryRows}
        />

        <ReportTable
          headers={[
            "Status",
            "Members",
            "Share",
          ]}
          rows={statusRows}
        />
      </section>

      <ReportTable
        headers={[
          "Activation State",
          "Members",
        ]}
        rows={activationRows}
      />

      <ExportPanel
        title="Membership exports"
        description="Download the connected membership and membership-period records."
        exports={[
          {
            label:
              "Download Members XLSX",
            path:
              "/reports/export/members?format=xlsx",
            fileName:
              "KUHRSA_members.xlsx",
          },
          {
            label:
              "Download Members CSV",
            path:
              "/reports/export/members?format=csv",
            fileName:
              "KUHRSA_members.csv",
          },
          {
            label:
              "Download Membership Periods XLSX",
            path:
              "/reports/export/membership-periods?format=xlsx",
            fileName:
              "KUHRSA_membershipPeriods.xlsx",
          },
          {
            label:
              "Download Membership Periods CSV",
            path:
              "/reports/export/membership-periods?format=csv",
            fileName:
              "KUHRSA_membershipPeriods.csv",
          },
        ]}
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div>
          <h2 className="text-lg font-black text-[#0B2633]">
            Recent membership records
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Latest records from the connected membership registry.
          </p>
        </div>

        <div className="mt-5">
          {recentMembers.length ? (
            <ReportTable
              headers={[
                "Member",
                "Category",
                "Status",
                "Registered",
              ]}
              rows={recentMembers.map(
                (member) => [
                  getMemberName(
                    member,
                  ),
                  formatCategory(
                    member.category,
                  ),
                  formatStatus(
                    member.status,
                  ),
                  formatDate(
                    member.createdAt,
                  ),
                ],
              )}
            />
          ) : (
            <EmptyState
              title="No membership records available"
              description="The connected membership registry currently contains no records for this organization."
            />
          )}
        </div>
      </section>
    </div>
  );
}

function FinanceReportView() {
  const {
    dashboard,
    loading,
    error,
    reload,
  } =
    useAdministrationDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          title="Finance Reports"
          description="Connected finance reporting for member charges and completed payments."
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.06]"
              />
            ),
          )}
        </section>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <Header
          title="Finance Reports"
          description="Connected finance reporting for member charges and completed payments."
        />

        <ErrorState
          message={
            error ??
            "The finance report could not be loaded."
          }
          onRetry={reload}
        />
      </div>
    );
  }

  const finance =
    dashboard.finance;

  const rows = [
    [
      "Completed payments",
      formatCurrency(
        finance.completedPaymentsAmount,
      ),
    ],
    [
      "Outstanding member balance",
      formatCurrency(
        finance.outstandingBalance,
      ),
    ],
    [
      "Overdue charges",
      formatNumber(
        finance.overdueCharges,
      ),
    ],
    [
      "Pending payments",
      formatNumber(
        finance.pendingPayments,
      ),
    ],
    [
      "Failed payments",
      formatNumber(
        finance.failedPayments,
      ),
    ],
    [
      "Cancelled payments",
      formatNumber(
        finance.cancelledPayments,
      ),
    ],
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Finance Reports"
        description="Connected financial reporting for completed payments, outstanding balances and payment states."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Completed Payments"
          value={formatCurrency(
            finance.completedPaymentsAmount,
          )}
        />

        <StatCard
          label="Outstanding"
          value={formatCurrency(
            finance.outstandingBalance,
          )}
        />

        <StatCard
          label="Overdue Charges"
          value={formatNumber(
            finance.overdueCharges,
          )}
        />

        <StatCard
          label="Pending Payments"
          value={formatNumber(
            finance.pendingPayments,
          )}
        />
      </section>

      <ReportTable
        headers={[
          "Finance Measure",
          "Value",
        ]}
        rows={rows}
      />

      <ExportPanel
        title="Finance exports"
        description="Download the connected charges and receipt records."
        exports={[
          {
            label:
              "Download Charges XLSX",
            path:
              "/reports/export/charges?format=xlsx",
            fileName:
              "KUHRSA_charges.xlsx",
          },
          {
            label:
              "Download Charges CSV",
            path:
              "/reports/export/charges?format=csv",
            fileName:
              "KUHRSA_charges.csv",
          },
          {
            label:
              "Download Receipts XLSX",
            path:
              "/reports/export/receipts?format=xlsx",
            fileName:
              "KUHRSA_receipts.xlsx",
          },
          {
            label:
              "Download Receipts CSV",
            path:
              "/reports/export/receipts?format=csv",
            fileName:
              "KUHRSA_receipts.csv",
          },
        ]}
      />

      <NotConnectedState
        title="Expense reporting is not connected"
        description="The current administration finance summary provides member charges and payment information. It does not expose an expense dataset, so no fabricated expense or net-position figures are shown."
      />
    </div>
  );
}

function PaymentReportView() {
  const {
    dashboard,
    loading,
    error,
    reload,
  } =
    useAdministrationDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          title="Payment Reports"
          description="Connected payment reporting for completed, pending, failed and cancelled payments."
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.06]"
              />
            ),
          )}
        </section>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <Header
          title="Payment Reports"
          description="Connected payment reporting for completed, pending, failed and cancelled payments."
        />

        <ErrorState
          message={
            error ??
            "The payment report could not be loaded."
          }
          onRetry={reload}
        />
      </div>
    );
  }

  const finance =
    dashboard.finance;

  const rows = [
    [
      "Completed payments",
      formatCurrency(
        finance.completedPaymentsAmount,
      ),
      "Completed amount",
    ],
    [
      "Pending payments",
      formatNumber(
        finance.pendingPayments,
      ),
      "Awaiting completion",
    ],
    [
      "Failed payments",
      formatNumber(
        finance.failedPayments,
      ),
      "Failed",
    ],
    [
      "Cancelled payments",
      formatNumber(
        finance.cancelledPayments,
      ),
      "Cancelled",
    ],
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Payment Reports"
        description="Payment state and completed-value reporting from the connected finance records."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Completed Value"
          value={formatCurrency(
            finance.completedPaymentsAmount,
          )}
        />

        <StatCard
          label="Pending"
          value={formatNumber(
            finance.pendingPayments,
          )}
        />

        <StatCard
          label="Failed"
          value={formatNumber(
            finance.failedPayments,
          )}
        />

        <StatCard
          label="Cancelled"
          value={formatNumber(
            finance.cancelledPayments,
          )}
        />
      </section>

      <ReportTable
        headers={[
          "Payment State",
          "Value",
          "Status",
        ]}
        rows={rows}
      />

      <ExportPanel
        title="Payment exports"
        description="Download the connected payment transaction records."
        exports={[
          {
            label:
              "Download Payments XLSX",
            path:
              "/reports/export/payments?format=xlsx",
            fileName:
              "KUHRSA_payments.xlsx",
          },
          {
            label:
              "Download Payments CSV",
            path:
              "/reports/export/payments?format=csv",
            fileName:
              "KUHRSA_payments.csv",
          },
        ]}
      />

      <NotConnectedState
        title="Payment-method breakdown is not connected"
        description="The current administration summary exposes payment states and completed payment value, but it does not expose a method-by-method aggregate. No synthetic M-Pesa, manual or other-payment figures are displayed."
      />
    </div>
  );
}

function EventReportView() {
  return (
    <div className="space-y-6">
      <Header
        title="Event Reports"
        description="Event registration, participation and operational reporting."
      />

      <NotConnectedState
        title="Event reporting is not connected yet"
        description="The administration dashboard currently marks event reporting as unavailable. Event counts, registrations and attendance figures will appear here once the event reporting dataset is connected."
      />

      <ExportPanel
        title="Event exports"
        description="No event export endpoint is currently connected to this workspace."
        exports={[]}
      />
    </div>
  );
}

function ActivityReportView() {
  return (
    <div className="space-y-6">
      <Header
        title="Activity Reports"
        description="Activity participation and programme performance."
      />

      <NotConnectedState
        title="Activity reporting is not connected yet"
        description="The administration dashboard currently marks activity reporting as unavailable. Participation and programme figures will appear here once the activity reporting dataset is connected."
      />
    </div>
  );
}

function ElectionReportView() {
  return (
    <div className="space-y-6">
      <Header
        title="Election Reports"
        description="Election cycle, voter participation, candidate and results reporting."
      />

      <NotConnectedState
        title="Election reporting is not connected yet"
        description="The election module may exist independently, but this Reports workspace does not currently have a verified election reporting dataset or export endpoint. No election figures are fabricated here."
      />
    </div>
  );
}

function CommunicationReportView() {
  const {
    dashboard,
    loading,
    error,
    reload,
  } =
    useAdministrationDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <Header
          title="Communication Reports"
          description="Connected notification reporting."
        />

        <div className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-black/[0.06]" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="space-y-6">
        <Header
          title="Communication Reports"
          description="Connected notification reporting."
        />

        <ErrorState
          message={
            error ??
            "The communication report could not be loaded."
          }
          onRetry={reload}
        />
      </div>
    );
  }

  const notifications =
    dashboard.notifications;

  const rows = [
    [
      "Total notifications",
      formatNumber(
        notifications.total,
      ),
      "Recorded",
    ],
    [
      "Sent",
      formatNumber(
        notifications.sent,
      ),
      "Sent",
    ],
    [
      "Pending",
      formatNumber(
        notifications.pending,
      ),
      "Pending",
    ],
    [
      "Failed",
      formatNumber(
        notifications.failed,
      ),
      "Failed",
    ],
    [
      "Cancelled",
      formatNumber(
        notifications.cancelled,
      ),
      "Cancelled",
    ],
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Communication Reports"
        description="Notification delivery state from the connected KUHRSA notification records."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Notifications"
          value={formatNumber(
            notifications.total,
          )}
        />

        <StatCard
          label="Sent"
          value={formatNumber(
            notifications.sent,
          )}
        />

        <StatCard
          label="Pending"
          value={formatNumber(
            notifications.pending,
          )}
        />

        <StatCard
          label="Failed"
          value={formatNumber(
            notifications.failed,
          )}
        />
      </section>

      <ReportTable
        headers={[
          "Notification State",
          "Count",
          "Status",
        ]}
        rows={rows}
      />

      <NotConnectedState
        title="Channel-level delivery reporting is not connected"
        description="The current notification summary provides notification states, but it does not expose verified email, SMS or in-app delivery aggregates. Those figures are therefore not displayed."
      />
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Membership Analytics"
        description="Trend analysis and intelligence for KUHRSA membership planning."
      />

      <NotConnectedState
        title="Membership analytics is not connected yet"
        description="The administration dashboard currently marks analytics as unavailable. No synthetic growth, renewal or trend figures are displayed."
      />
    </div>
  );
}

function CustomReportView() {
  return (
    <div className="space-y-6">
      <Header
        title="Custom Reports"
        description="Configurable administrative reporting from approved backend data sources."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div>
          <h2 className="text-lg font-black text-[#0B2633]">
            Report Builder
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
            Custom report queries, filters, field selection and scheduled report generation are not connected to the backend yet.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            "Membership",
            "Membership Periods",
            "Payments",
            "Charges",
            "Receipts",
          ].map(
            (source) => (
              <span
                key={source}
                className="rounded-full bg-[#F8FBFC] px-3 py-2 text-xs font-bold text-[#0B2633]"
              >
                {source}
              </span>
            ),
          )}
        </div>

        <button
          type="button"
          disabled
          className="mt-6 cursor-not-allowed rounded-xl bg-slate-200 px-5 py-3 text-xs font-black text-slate-500"
        >
          Generate Report
        </button>
      </section>

      <NotConnectedState
        title="Custom report generation is not connected"
        description="The existing backend provides controlled exports for specific datasets. A configurable report builder requires a separate approved query/filter layer and is not being simulated in the frontend."
      />
    </div>
  );
}

export default function AdministrationReportsWorkspace({
  view,
}: Props) {
  switch (view) {
    case "membership":
      return (
        <MembershipReportView />
      );

    case "finance":
      return (
        <FinanceReportView />
      );

    case "payments":
      return (
        <PaymentReportView />
      );

    case "events":
      return (
        <EventReportView />
      );

    case "activities":
      return (
        <ActivityReportView />
      );

    case "elections":
      return (
        <ElectionReportView />
      );

    case "communication":
      return (
        <CommunicationReportView />
      );

    case "analytics":
      return (
        <AnalyticsView />
      );

    case "custom":
      return (
        <CustomReportView />
      );

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
