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

type AdministrationDashboardView =
  | "dashboard"
  | "overview"
  | "statistics"
  | "analytics"
  | "activity"
  | "alerts";

type Props = {
  view: AdministrationDashboardView;
};

type DashboardData = {
  portal: "administration";

  membership: {
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

  users: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
    lockedUsers: number;
  };

  governance: {
    totalPositions: number;
    activePositions: number;
    totalAssignments: number;
    activeAssignments: number;
    pendingAssignments: number;
    activeTerms: number;
  };

  finance: {
    outstandingBalance: string;
    completedPaymentsAmount: string;
    overdueCharges: number;
    pendingPayments: number;
    failedPayments: number;
    cancelledPayments: number;
  };

  notifications: {
    total: number;
    pending: number;
    sent: number;
    failed: number;
    cancelled: number;
  };

  audit: {
    recent: AuditLog[];
  };

  alerts: DashboardAlert[];

  availability: {
    events: boolean;
    activities: boolean;
    requests: boolean;
    analytics: boolean;
  };
};

type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  reason: string | null;
  createdAt: string;
  actor: {
    id: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string;
  } | null;
};

type DashboardAlert = {
  level: string;
  key: string;
  title: string;
  detail: string;
  count: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    "",
  ) ?? "http://localhost:3001";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
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
      ...options,

      headers: {
        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        Authorization: `Bearer ${token}`,

        ...(options.headers ?? {}),
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

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value);
}

function formatCurrency(
  value: string,
) {
  const numericValue = Number(value);

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
      timeStyle: "short",
    },
  ).format(date);
}

function displayActor(
  actor: AuditLog["actor"],
) {
  if (!actor) {
    return "System";
  }

  const name = [
    actor.firstName,
    actor.middleName,
    actor.lastName,
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value?.trim()),
    )
    .join(" ");

  return name || actor.email;
}

function formatAction(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function formatEntity(
  value: string,
) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function useAdministrationDashboard() {
  const [
    data,
    setData,
  ] = useState<DashboardData | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const load = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const result =
          await apiRequest<DashboardData>(
            "/dashboard/administration",
          );

        setData(result);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The administration dashboard could not be loaded.",
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
    data,
    loading,
    error,
    reload: load,
  };
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#CE26A4]">
        Dashboard & Intelligence
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
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_20px_rgba(11,38,51,0.03)]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>

      {detail ? (
        <p className="mt-1 text-xs font-bold text-[#CE26A4]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-black text-[#0B2633]">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 text-sm text-black/45">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-black/[0.06]">
      <p className="text-sm font-bold text-black/50">
        Loading administration data...
      </p>
    </div>
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
    <div className="rounded-3xl border border-red-200 bg-white p-8 ring-1 ring-red-100">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-red-500">
        Dashboard unavailable
      </p>

      <h2 className="mt-2 text-lg font-black text-[#0B2633]">
        We could not load the administration data.
      </h2>

      <p className="mt-2 text-sm leading-6 text-black/50">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-[#0B2633] px-4 py-2.5 text-xs font-black text-white transition hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}

function UnavailableState({
  title = "Data not available yet",
  description = "This dashboard area does not have a connected backend data source yet.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-black/[0.10] bg-[#F8FBFC] p-8 text-center">
      <p className="text-sm font-black text-[#0B2633]">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/45">
        {description}
      </p>
    </div>
  );
}

function DashboardView({
  data,
}: {
  data: DashboardData;
}) {
  const quickLinks = [
    {
      label: "Membership",
      href: "/administration/members",
    },
    {
      label: "Users",
      href: "/administration/users",
    },
    {
      label: "Notifications",
      href: "/administration/notifications",
    },
    {
      label: "Finance",
      href: "/administration/finance",
    },
    {
      label: "Content",
      href: "/administration/content",
    },
    {
      label: "Reports",
      href: "/administration/reports",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="High-level oversight of KUHRSA membership, governance, finance, communications and administrative activity."
      />

      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total Members"
            value={formatNumber(
              data.membership.totalMembers,
            )}
            detail={`${formatNumber(
              data.membership.activeMembers,
            )} active`}
          />

          <StatCard
            label="Pending Members"
            value={formatNumber(
              data.membership.pendingMembers,
            )}
            detail={`${formatNumber(
              data.membership.activationPending,
            )} activation pending`}
          />

          <StatCard
            label="Active Executives"
            value={formatNumber(
              data.governance.activeAssignments,
            )}
            detail={`${formatNumber(
              data.governance.activePositions,
            )} active positions`}
          />

          <StatCard
            label="Outstanding Balance"
            value={formatCurrency(
              data.finance.outstandingBalance,
            )}
            detail={`${formatNumber(
              data.finance.overdueCharges,
            )} overdue charges`}
          />

          <StatCard
            label="Completed Payments"
            value={formatCurrency(
              data.finance.completedPaymentsAmount,
            )}
            detail={`${formatNumber(
              data.finance.pendingPayments,
            )} pending`}
          />

          <StatCard
            label="Active User Accounts"
            value={formatNumber(
              data.users.activeUsers,
            )}
            detail={`${formatNumber(
              data.users.totalUsers,
            )} total accounts`}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[0_6px_24px_rgba(11,38,51,0.03)]">
          <SectionTitle
            title="Recent Administrative Activity"
            description="Recent organization-scoped audit records."
          />

          <div className="mt-5 space-y-3">
            {data.audit.recent.length > 0 ? (
              data.audit.recent.map(
                (item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl bg-[#F8FBFC] p-4"
                  >
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#CE26A4]/10 text-xs font-black text-[#CE26A4]">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#0B2633]">
                        {formatAction(
                          item.action,
                        )}{" "}
                        {formatEntity(
                          item.entityType,
                        )}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-black/45">
                        {displayActor(
                          item.actor,
                        )}{" "}
                        •{" "}
                        {formatDate(
                          item.createdAt,
                        )}
                      </p>

                      {item.reason ? (
                        <p className="mt-1 text-xs leading-5 text-black/40">
                          {item.reason}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ),
              )
            ) : (
              <UnavailableState
                title="No recent administrative activity"
                description="No organization-scoped audit records are currently available."
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[0_6px_24px_rgba(11,38,51,0.03)]">
          <SectionTitle
            title="Alerts"
            description="Items generated from real administrative data."
          />

          <div className="mt-5 space-y-3">
            {data.alerts.length > 0 ? (
              data.alerts.map(
                (item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-[#CE26A4]/10 bg-[#FFF7FC] p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#CE26A4]">
                      {item.level}
                    </p>

                    <p className="mt-2 text-sm font-black text-[#0B2633]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/50">
                      {item.detail}
                    </p>
                  </div>
                ),
              )
            ) : (
              <UnavailableState
                title="No active alerts"
                description="There are currently no dashboard alerts generated from the connected administrative data."
              />
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[0_6px_24px_rgba(11,38,51,0.03)]">
        <SectionTitle
          title="Quick Access"
          description="Jump directly into major administration areas."
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-[#F8FBFC] px-4 py-4 text-sm font-bold text-[#0B2633] transition hover:border-[#CE26A4]/20 hover:bg-[#FFF7FC]"
              >
                {item.label}

                <span className="text-[#CE26A4]">
                  →
                </span>
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function OverviewView({
  data,
}: {
  data: DashboardData;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="A consolidated view of the current KUHRSA administrative environment using connected backend data."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Members"
          value={formatNumber(
            data.membership.totalMembers,
          )}
          detail={`${formatNumber(
            data.membership.activeMembers,
          )} active`}
        />

        <StatCard
          label="User Accounts"
          value={formatNumber(
            data.users.totalUsers,
          )}
          detail={`${formatNumber(
            data.users.activeUsers,
          )} active`}
        />

        <StatCard
          label="Active Assignments"
          value={formatNumber(
            data.governance.activeAssignments,
          )}
          detail={`${formatNumber(
            data.governance.pendingAssignments,
          )} pending`}
        />

        <StatCard
          label="Outstanding Balance"
          value={formatCurrency(
            data.finance.outstandingBalance,
          )}
        />

        <StatCard
          label="Notifications"
          value={formatNumber(
            data.notifications.total,
          )}
          detail={`${formatNumber(
            data.notifications.failed,
          )} failed`}
        />

        <StatCard
          label="Active Terms"
          value={formatNumber(
            data.governance.activeTerms,
          )}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <SectionTitle
            title="Operational Summary"
            description="Current values calculated from the connected backend."
          />

          <div className="mt-5 space-y-4">
            {[
              [
                "Membership",
                `${formatNumber(
                  data.membership.activeMembers,
                )} active`,
              ],
              [
                "Governance",
                `${formatNumber(
                  data.governance.activeAssignments,
                )} active assignments`,
              ],
              [
                "Finance",
                formatCurrency(
                  data.finance.outstandingBalance,
                ) +
                  " outstanding",
              ],
              [
                "Users",
                `${formatNumber(
                  data.users.activeUsers,
                )} active accounts`,
              ],
              [
                "Notifications",
                `${formatNumber(
                  data.notifications.pending,
                )} pending`,
              ],
            ].map(
              ([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl bg-[#F8FBFC] px-4 py-3"
                >
                  <span className="text-sm font-semibold text-black/60">
                    {label}
                  </span>

                  <span className="text-right text-sm font-black text-[#0B2633]">
                    {value}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <SectionTitle
            title="Administrative Focus"
            description="Current items generated from actual backend records."
          />

          <div className="mt-5 space-y-3">
            {data.alerts.length > 0 ? (
              data.alerts.map(
                (item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl bg-[#FFF7FC] p-4"
                  >
                    <p className="text-sm font-black text-[#0B2633]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/50">
                      {item.detail}
                    </p>
                  </div>
                ),
              )
            ) : (
              <UnavailableState
                title="No current administrative focus items"
                description="No connected dashboard alerts currently require attention."
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatisticsView({
  data,
}: {
  data: DashboardData;
}) {
  const categories = [
    {
      label: "Students",
      value: data.membership.students,
    },
    {
      label: "Alumni",
      value: data.membership.alumni,
    },
    {
      label: "Lecturers",
      value: data.membership.lecturers,
    },
  ];

  const totalMembers =
    data.membership.totalMembers;

  const categoryRows = categories.map(
    (item) => ({
      ...item,
      percentage:
        totalMembers > 0
          ? Math.round(
              (item.value /
                totalMembers) *
                100,
            )
          : 0,
    }),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quick Statistics"
        description="Current membership, governance, finance and account statistics calculated from KUHRSA data."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Members"
          value={formatNumber(
            data.membership.totalMembers,
          )}
        />

        <StatCard
          label="Active Members"
          value={formatNumber(
            data.membership.activeMembers,
          )}
        />

        <StatCard
          label="Pending Members"
          value={formatNumber(
            data.membership.pendingMembers,
          )}
        />

        <StatCard
          label="Active User Accounts"
          value={formatNumber(
            data.users.activeUsers,
          )}
        />

        <StatCard
          label="Active Executives"
          value={formatNumber(
            data.governance.activeAssignments,
          )}
        />

        <StatCard
          label="Overdue Charges"
          value={formatNumber(
            data.finance.overdueCharges,
          )}
        />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <SectionTitle
          title="Membership Category Distribution"
          description={
            totalMembers > 0
              ? "Distribution calculated from the current member records."
              : "No member records are currently available."
          }
        />

        {totalMembers > 0 ? (
          <div className="mt-6 space-y-4">
            {categoryRows.map(
              (item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-black/60">
                      {item.label}
                    </span>

                    <span className="text-sm font-black text-[#0B2633]">
                      {formatNumber(
                        item.value,
                      )}{" "}
                      ({item.percentage}%)
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-black/[0.05]">
                    <div
                      className="h-full rounded-full bg-[#CE26A4]"
                      style={{
                        width: `${Math.min(
                          item.percentage,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mt-6">
            <UnavailableState
              title="No membership records yet"
              description="Category distribution will appear automatically when real member records are available."
            />
          </div>
        )}
      </section>
    </div>
  );
}

function AnalyticsView({
  data,
}: {
  data: DashboardData;
}) {
  const analyticsAvailable =
    data.availability.analytics;

  const collectionRate = useMemo(() => {
    const outstanding =
      Number(
        data.finance.outstandingBalance,
      );

    const completed =
      Number(
        data.finance
          .completedPaymentsAmount,
      );

    if (
      !Number.isFinite(
        outstanding,
      ) ||
      !Number.isFinite(completed)
    ) {
      return null;
    }

    const total =
      outstanding + completed;

    if (total <= 0) {
      return null;
    }

    return Math.round(
      (completed / total) * 100,
    );
  }, [data]);

  if (!analyticsAvailable) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reports & Analytics"
          description="Administrative intelligence views for trends, performance and planning."
        />

        <section className="grid gap-4 lg:grid-cols-3">
          <StatCard
            label="Membership Growth"
            value="Not available"
            detail="No historical trend endpoint"
          />

          <StatCard
            label="Event Participation"
            value="Not available"
            detail="Events analytics not connected"
          />

          <StatCard
            label="Collection Rate"
            value={
              collectionRate !== null
                ? `${collectionRate}%`
                : "Not available"
            }
            detail={
              collectionRate !== null
                ? "Calculated from current finance totals"
                : "Insufficient finance data"
            }
          />
        </section>

        <UnavailableState
          title="Historical analytics are not connected yet"
          description="The current backend provides live operational totals but does not yet provide historical time-series data for membership growth, event participation or broader analytics. No synthetic trend is displayed."
        />
      </div>
    );
  }

  return null;
}

function ActivityView({
  data,
}: {
  data: DashboardData;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Recent Activities"
        description="A centralized administrative activity stream based on organization-scoped audit records."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        {data.audit.recent.length > 0 ? (
          <div className="space-y-3">
            {data.audit.recent.map(
              (item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 rounded-2xl border border-black/[0.05] p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#CE26A4]/10 text-xs font-black text-[#CE26A4]">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#0B2633]">
                      {formatAction(
                        item.action,
                      )}{" "}
                      {formatEntity(
                        item.entityType,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {displayActor(
                        item.actor,
                      )}{" "}
                      •{" "}
                      {formatDate(
                        item.createdAt,
                      )}
                    </p>

                    {item.reason ? (
                      <p className="mt-1 text-xs leading-5 text-black/45">
                        {item.reason}
                      </p>
                    ) : null}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <UnavailableState
            title="No recent activity"
            description="No organization-scoped audit records are currently available."
          />
        )}
      </section>
    </div>
  );
}

function AlertsView({
  data,
}: {
  data: DashboardData;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Administrative warnings and items requiring attention, generated from real backend records."
      />

      <section className="space-y-4">
        {data.alerts.length > 0 ? (
          data.alerts.map(
            (item) => (
              <div
                key={item.key}
                className="rounded-3xl border border-[#CE26A4]/10 bg-white p-6 ring-1 ring-black/[0.05]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#CE26A4]">
                      {item.level}
                    </p>

                    <h2 className="mt-2 text-lg font-black text-[#0B2633]">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-black/50">
                      {item.detail}
                    </p>
                  </div>

                  <span className="rounded-xl bg-[#FFF7FC] px-3 py-2 text-xs font-black text-[#CE26A4]">
                    {formatNumber(
                      item.count,
                    )}
                  </span>
                </div>
              </div>
            ),
          )
        ) : (
          <UnavailableState
            title="No active alerts"
            description="There are currently no alerts generated from the connected administration data."
          />
        )}
      </section>
    </div>
  );
}

function DashboardContent({
  view,
  data,
}: {
  view: AdministrationDashboardView;
  data: DashboardData;
}) {
  switch (view) {
    case "overview":
      return (
        <OverviewView data={data} />
      );

    case "statistics":
      return (
        <StatisticsView data={data} />
      );

    case "analytics":
      return (
        <AnalyticsView data={data} />
      );

    case "activity":
      return (
        <ActivityView data={data} />
      );

    case "alerts":
      return (
        <AlertsView data={data} />
      );

    case "dashboard":
    default:
      return (
        <DashboardView data={data} />
      );
  }
}

export default function AdministrationDashboardWorkspace({
  view,
}: Props) {
  const {
    data,
    loading,
    error,
    reload,
  } =
    useAdministrationDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Administration Dashboard"
          description="Loading current KUHRSA administrative data."
        />

        <LoadingState />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Administration Dashboard"
          description="Current KUHRSA administrative information."
        />

        <ErrorState
          message={
            error ??
            "No administration dashboard data was returned."
          }
          onRetry={reload}
        />
      </div>
    );
  }

  return (
    <DashboardContent
      view={view}
      data={data}
    />
  );
}
