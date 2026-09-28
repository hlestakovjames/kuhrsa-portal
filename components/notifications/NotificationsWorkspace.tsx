"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED"
  | "CANCELLED"
  | string;

type NotificationChannel =
  | "EMAIL"
  | "SMS"
  | "IN_APP"
  | string;

type NotificationType =
  | "MIGRATION_WELCOME"
  | "ACCOUNT_ACTIVATED"
  | "MEMBERSHIP_RENEWAL"
  | "PAYMENT_CONFIRMATION"
  | "PASSWORD_RESET"
  | "GENERAL_NOTICE"
  | string;

type NotificationMember = {
  id: string;
  memberNumber: string;
  email?: string | null;
  phone?: string | null;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

type NotificationUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
};

type NotificationOrganization = {
  id: string;
  name: string;
};

type NotificationRecord = {
  id: string;
  organizationId: string;
  memberId?: string | null;
  userId?: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  recipient: string;
  subject?: string | null;
  templateKey?: string | null;
  providerMessageId?: string | null;
  sentAt?: string | null;
  failedAt?: string | null;
  errorMessage?: string | null;
  attempts: number;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  member?: NotificationMember | null;
  user?: NotificationUser | null;
  organization?: NotificationOrganization | null;
};

type NotificationListResponse = {
  data: NotificationRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type NotificationSummary = {
  total: number;
  statuses: {
    sent: number;
    failed: number;
    pending: number;
    cancelled: number;
  };
  channels: {
    email: number;
    sms: number;
    inApp: number;
  };
};

type StatusFilter =
  | "ALL"
  | "SENT"
  | "FAILED"
  | "PENDING"
  | "CANCELLED";

type ChannelFilter =
  | "ALL"
  | "EMAIL"
  | "SMS"
  | "IN_APP";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const DEFAULT_SUMMARY: NotificationSummary = {
  total: 0,
  statuses: {
    sent: 0,
    failed: 0,
    pending: 0,
    cancelled: 0,
  },
  channels: {
    email: 0,
    sms: 0,
    inApp: 0,
  },
};

async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options?.headers ?? {}),
      },
      cache: "no-store",
    },
  );

  const data: unknown =
    await response.json().catch(() => null);

  if (!response.ok) {
    if (
      data &&
      typeof data === "object" &&
      "message" in data
    ) {
      const message = (
        data as {
          message?: unknown;
        }
      ).message;

      if (typeof message === "string") {
        throw new Error(message);
      }

      if (Array.isArray(message)) {
        throw new Error(
          message
            .filter(
              (item): item is string =>
                typeof item === "string",
            )
            .join(", "),
        );
      }
    }

    if (response.status === 401) {
      throw new Error(
        "Your session has expired. Please sign in again.",
      );
    }

    if (response.status === 403) {
      throw new Error(
        "You do not have permission to view notifications.",
      );
    }

    throw new Error(
      `Request failed with status ${response.status}.`,
    );
  }

  return data as T;
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatTemplateKey(
  value?: string | null,
) {
  switch (value) {
    case "migration-welcome":
      return "Email Migration Welcome";

    case "migration-welcome-sms":
      return "SMS Migration Welcome";

    default:
      return value
        ? formatLabel(value.replace(/-/g, "_"))
        : "—";
  }
}

function formatDateTime(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(
    "en-KE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function getMemberName(
  notification: NotificationRecord,
) {
  const first =
    notification.member?.user?.firstName?.trim() ??
    "";

  const last =
    notification.member?.user?.lastName?.trim() ??
    "";

  const name =
    `${first} ${last}`.trim();

  if (name) {
    return name;
  }

  return (
    notification.member?.memberNumber ??
    notification.recipient
  );
}

function getStatusTone(
  status: string,
) {
  switch (status.toUpperCase()) {
    case "SENT":
      return "bg-emerald-50 text-emerald-700";

    case "FAILED":
      return "bg-red-50 text-red-700";

    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "CANCELLED":
      return "bg-slate-100 text-slate-500";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusDot(
  status: string,
) {
  switch (status.toUpperCase()) {
    case "SENT":
      return "bg-emerald-500";

    case "FAILED":
      return "bg-red-500";

    case "PENDING":
      return "bg-amber-500";

    case "CANCELLED":
      return "bg-slate-400";

    default:
      return "bg-slate-400";
  }
}

function getChannelTone(
  channel: string,
) {
  switch (channel.toUpperCase()) {
    case "EMAIL":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "SMS":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";

    case "IN_APP":
      return "border-violet-200 bg-violet-50 text-violet-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getChannelIcon(
  channel: string,
) {
  switch (channel.toUpperCase()) {
    case "EMAIL":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "SMS":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M20 11.5a7 7 0 0 1-7 7H7l-4 3v-3.9A7 7 0 0 1 6 5h7a7 7 0 0 1 7 6.5Z" />
        </svg>
      );

    case "IN_APP":
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    default:
      return (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
          />
        </svg>
      );
  }
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-500">
            {label}
          </div>

          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {value}
          </div>

          <div className="mt-1 text-xs text-slate-400">
            {detail}
          </div>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 text-sm font-semibold text-slate-900">
        {title}
      </div>

      {children}
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </div>

      <div className="mt-1 break-words text-sm text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}

function MetadataField({
  label,
  value,
}: {
  label: string;
  value: unknown;
}) {
  let display = "—";

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    display = String(value);
  }

  return (
    <Field
      label={label}
      value={display}
    />
  );
}

function getProviderStatus(
  notification: NotificationRecord,
) {
  const metadata =
    notification.metadata ?? {};

  return (
    metadata.providerStatus ??
    metadata.smsProviderStatus ??
    null
  );
}

function getProviderCost(
  notification: NotificationRecord,
) {
  const metadata =
    notification.metadata ?? {};

  return (
    metadata.providerCost ??
    metadata.smsProviderCost ??
    null
  );
}

function getMetadataString(
  notification: NotificationRecord,
  key: string,
) {
  const value =
    notification.metadata?.[key];

  return typeof value === "string"
    ? value
    : null;
}

function getNotificationTypeLabel(
  notification: NotificationRecord,
) {
  return formatLabel(
    notification.type,
  );
}

function getNotificationSubtitle(
  notification: NotificationRecord,
) {
  return formatTemplateKey(
    notification.templateKey,
  );
}

function isRetryable(
  notification: NotificationRecord,
) {
  const status =
    notification.status.toUpperCase();

  return (
    status === "FAILED" ||
    status === "PENDING"
  );
}

export default function NotificationsWorkspace() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<NotificationRecord[]>([]);

  const [summary, setSummary] =
    useState<NotificationSummary>(
      DEFAULT_SUMMARY,
    );

  const [loading, setLoading] =
    useState(true);

  const [summaryLoading, setSummaryLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [channelFilter, setChannelFilter] =
    useState<ChannelFilter>("ALL");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalResults, setTotalResults] =
    useState(0);

  const [
    selectedNotification,
    setSelectedNotification,
  ] = useState<NotificationRecord | null>(
    null,
  );

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [detailError, setDetailError] =
    useState("");

  const [retryingId, setRetryingId] =
    useState<string | null>(null);

  const limit = 25;

  const loadSummary =
    useCallback(async () => {
      setSummaryLoading(true);

      try {
        const data =
          await apiRequest<NotificationSummary>(
            "/notifications/summary",
          );

        setSummary(data);
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          /session|authenticated|expired/i.test(
            requestError.message,
          )
        ) {
          router.replace("/login");
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load notification summary.",
        );
      } finally {
        setSummaryLoading(false);
      }
    }, [router]);

  const loadNotifications =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      params.set(
        "page",
        String(page),
      );

      params.set(
        "limit",
        String(limit),
      );

      if (search.trim()) {
        params.set(
          "search",
          search.trim(),
        );
      }

      if (statusFilter !== "ALL") {
        params.set(
          "status",
          statusFilter,
        );
      }

      if (channelFilter !== "ALL") {
        params.set(
          "channel",
          channelFilter,
        );
      }

      try {
        const data =
          await apiRequest<NotificationListResponse>(
            `/notifications?${params.toString()}`,
          );

        setNotifications(
          data.data,
        );

        setTotalResults(
          data.pagination.total,
        );

        setTotalPages(
          Math.max(
            data.pagination.totalPages,
            1,
          ),
        );
      } catch (requestError) {
        if (
          requestError instanceof Error &&
          /session|authenticated|expired/i.test(
            requestError.message,
          )
        ) {
          router.replace("/login");
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load notifications.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      channelFilter,
      page,
      router,
      search,
      statusFilter,
    ]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadSummary();
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadSummary]);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadNotifications();
      }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadNotifications]);

  async function openNotification(
    notificationId: string,
  ) {
    setDetailLoading(true);
    setDetailError("");

    try {
      const data =
        await apiRequest<NotificationRecord>(
          `/notifications/${notificationId}`,
        );

      setSelectedNotification(
        data,
      );
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load notification details.",
      );
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleRetry(
    notification: NotificationRecord,
  ) {
    setRetryingId(
      notification.id,
    );

    setError("");

    try {
      await apiRequest(
        `/notifications/${notification.id}/retry`,
        {
          method: "POST",
        },
      );

      await Promise.all([
        loadNotifications(),
        loadSummary(),
      ]);

      if (
        selectedNotification?.id ===
        notification.id
      ) {
        await openNotification(
          notification.id,
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to retry notification.",
      );
    } finally {
      setRetryingId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setChannelFilter("ALL");
    setPage(1);
  }

  function handleStatusFilter(
    value: StatusFilter,
  ) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleChannelFilter(
    value: ChannelFilter,
  ) {
    setChannelFilter(value);
    setPage(1);
  }

  function closeDetails() {
    setSelectedNotification(null);
    setDetailError("");
  }

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "ALL" ||
    channelFilter !== "ALL";

  const firstResult =
    totalResults === 0
      ? 0
      : (page - 1) * limit + 1;

  const lastResult =
    totalResults === 0
      ? 0
      : Math.min(
          page * limit,
          totalResults,
        );

  const selectedMetadata =
    selectedNotification?.metadata ??
    {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-400">
            Administration
          </div>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Notifications
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Monitor KUHRSA system
            notifications, delivery
            channels, failures and
            notification history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void Promise.all([
              loadNotifications(),
              loadSummary(),
            ]);
          }}
          disabled={
            loading ||
            summaryLoading
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${
              loading || summaryLoading
                ? "animate-spin"
                : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M20 11a8 8 0 0 0-14.9-4" />
            <path d="M4 5v4h4" />
            <path d="M4 13a8 8 0 0 0 14.9 4" />
            <path d="M20 19v-4h-4" />
          </svg>

          Refresh
        </button>
      </div>

      {/* Global error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
            />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Notifications"
          value={
            summaryLoading
              ? 0
              : summary.total
          }
          detail="All recorded system notifications"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
          }
        />

        <StatCard
          label="Sent"
          value={
            summaryLoading
              ? 0
              : summary.statuses.sent
          }
          detail="Successfully processed"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          }
        />

        <StatCard
          label="Failed"
          value={
            summaryLoading
              ? 0
              : summary.statuses.failed
          }
          detail="Require attention or retry"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 4.7 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z" />
            </svg>
          }
        />

        <StatCard
          label="Pending"
          value={
            summaryLoading
              ? 0
              : summary.statuses.pending
          }
          detail="Awaiting processing"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path d="M12 7v5l3 2" />
            </svg>
          }
        />
      </div>

      {/* Channel summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                Email
              </div>

              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.channels.email}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                Email notifications
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {getChannelIcon("EMAIL")}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                SMS
              </div>

              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.channels.sms}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                SMS notifications
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              {getChannelIcon("SMS")}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                In-App
              </div>

              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {summary.channels.inApp}
              </div>

              <div className="mt-1 text-xs text-slate-400">
                In-app notifications
              </div>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              {getChannelIcon("IN_APP")}
            </div>
          </div>
        </div>
      </div>

      {/* Notification management */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Filters */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="w-full max-w-xl">
              <label
                htmlFor="notification-search"
                className="sr-only"
              >
                Search notifications
              </label>

              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  id="notification-search"
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value,
                    );
                    setPage(1);
                  }}
                  placeholder="Search by recipient, subject or error..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#168DB8] focus:bg-white focus:ring-4 focus:ring-[#168DB8]/10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ALL", "All"],
                  ["SENT", "Sent"],
                  ["FAILED", "Failed"],
                  ["PENDING", "Pending"],
                  ["CANCELLED", "Cancelled"],
                ] as const
              ).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleStatusFilter(
                        value,
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      statusFilter ===
                      value
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ALL", "All Channels"],
                  ["EMAIL", "Email"],
                  ["SMS", "SMS"],
                  ["IN_APP", "In-App"],
                ] as const
              ).map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleChannelFilter(
                        value,
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      channelFilter ===
                      value
                        ? "border-[#168DB8] bg-[#168DB8] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {value !== "ALL" &&
                      getChannelIcon(
                        value,
                      )}

                    {label}
                  </button>
                ),
              )}
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={
                  resetFilters
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v5h5" />
                </svg>

                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Result header */}
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">
              {totalResults}{" "}
              {totalResults === 1
                ? "notification"
                : "notifications"}
            </div>

            <div className="mt-0.5 text-xs text-slate-400">
              {totalResults === 0
                ? "No matching records"
                : `Showing ${firstResult}–${lastResult} of ${totalResults}`}
            </div>
          </div>

          {(statusFilter !== "ALL" ||
            channelFilter !== "ALL") && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {statusFilter !==
                "ALL" && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                  Status:{" "}
                  {formatLabel(
                    statusFilter,
                  )}
                </span>
              )}

              {channelFilter !==
                "ALL" && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                  Channel:{" "}
                  {formatLabel(
                    channelFilter,
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">
                  Notification
                </th>

                <th className="px-5 py-3 font-semibold">
                  Member
                </th>

                <th className="px-5 py-3 font-semibold">
                  Recipient
                </th>

                <th className="px-5 py-3 font-semibold">
                  Channel
                </th>

                <th className="px-5 py-3 font-semibold">
                  Status
                </th>

                <th className="px-5 py-3 font-semibold">
                  Attempts
                </th>

                <th className="px-5 py-3 font-semibold">
                  Created
                </th>

                <th className="px-5 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-xs flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <svg
                          className="h-5 w-5 animate-spin text-slate-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            className="opacity-25"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            d="M21 12a9 9 0 0 0-9-9"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>

                      <div className="mt-3 text-sm font-semibold text-slate-700">
                        Loading notifications...
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        Fetching the latest notification records.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : notifications.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                          <path d="M10 21h4" />
                        </svg>
                      </div>

                      <div className="mt-3 text-sm font-semibold text-slate-700">
                        No notifications found
                      </div>

                      <div className="mt-1 text-sm text-slate-400">
                        {hasFilters
                          ? "Try adjusting or clearing the current filters."
                          : "There are no notification records to display."}
                      </div>

                      {hasFilters && (
                        <button
                          type="button"
                          onClick={
                            resetFilters
                          }
                          className="mt-4 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map(
                  (notification) => {
                    const failed =
                      notification.status.toUpperCase() ===
                      "FAILED";

                    return (
                      <tr
                        key={
                          notification.id
                        }
                        className="group transition hover:bg-slate-50/60"
                      >
                        {/* Notification */}
                        <td className="px-5 py-4 align-top">
                          <div className="max-w-[280px]">
                            <div className="text-sm font-semibold text-slate-900">
                              {notification.subject ||
                                getNotificationTypeLabel(
                                  notification,
                                )}
                            </div>

                            <div className="mt-1 text-xs font-medium text-slate-500">
                              {getNotificationTypeLabel(
                                notification,
                              )}
                            </div>

                            <div className="mt-1 text-xs text-slate-400">
                              {getNotificationSubtitle(
                                notification,
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Member */}
                        <td className="px-5 py-4 align-top">
                          <div className="text-sm font-medium text-slate-800">
                            {getMemberName(
                              notification,
                            )}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            {notification.member
                              ?.memberNumber ??
                              "No member number"}
                          </div>
                        </td>

                        {/* Recipient */}
                        <td className="px-5 py-4 align-top">
                          <div className="max-w-[220px] break-words text-sm font-medium text-slate-700">
                            {
                              notification.recipient
                            }
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="px-5 py-4 align-top">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getChannelTone(
                              notification.channel,
                            )}`}
                          >
                            {getChannelIcon(
                              notification.channel,
                            )}

                            {formatLabel(
                              notification.channel,
                            )}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 align-top">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(
                              notification.status,
                            )}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                                notification.status,
                              )}`}
                            />

                            {formatLabel(
                              notification.status,
                            )}
                          </span>

                          {failed &&
                            notification.errorMessage && (
                              <div className="mt-2 max-w-[260px] rounded-lg border border-red-100 bg-red-50 px-2.5 py-2">
                                <div className="flex items-start gap-1.5">
                                  <svg
                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    aria-hidden="true"
                                  >
                                    <circle
                                      cx="12"
                                      cy="12"
                                      r="9"
                                    />

                                    <path d="M12 8v5" />

                                    <path d="M12 16h.01" />
                                  </svg>

                                  <div className="min-w-0">
                                    <div className="text-[10px] font-black uppercase tracking-[0.1em] text-red-500">
                                      Delivery error
                                    </div>

                                    <div
                                      className="mt-0.5 break-words text-[11px] leading-4 text-red-600"
                                      title={
                                        notification.errorMessage
                                      }
                                    >
                                      {
                                        notification.errorMessage
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </td>

                        {/* Attempts */}
                        <td className="px-5 py-4 align-top">
                          <div className="whitespace-nowrap text-sm font-medium text-slate-700">
                            {notification.attempts}{" "}
                            {notification.attempts ===
                            1
                              ? "attempt"
                              : "attempts"}
                          </div>
                        </td>

                        {/* Created */}
                        <td className="px-5 py-4 align-top text-sm text-slate-500">
                          {formatDateTime(
                            notification.createdAt,
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                void openNotification(
                                  notification.id,
                                )
                              }
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              View
                            </button>

                            {isRetryable(
                              notification,
                            ) && (
                              <button
                                type="button"
                                disabled={
                                  retryingId ===
                                  notification.id
                                }
                                onClick={() =>
                                  void handleRetry(
                                    notification,
                                  )
                                }
                                className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {retryingId ===
                                notification.id
                                  ? "Retrying..."
                                  : "Retry"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-400">
            Page{" "}
            <span className="font-semibold text-slate-600">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {totalPages}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                page <= 1 ||
                loading
              }
              onClick={() =>
                setPage((current) =>
                  Math.max(
                    current - 1,
                    1,
                  ),
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                page >= totalPages ||
                loading
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    current + 1,
                    totalPages,
                  ),
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Notification detail modal */}
      {(selectedNotification ||
        detailLoading ||
        detailError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-400">
                    Notification Details
                  </div>

                  <h2 className="mt-1 truncate text-2xl font-semibold text-slate-900">
                    {selectedNotification
                      ? selectedNotification.subject ||
                        getNotificationTypeLabel(
                          selectedNotification,
                        )
                      : "Loading..."}
                  </h2>

                  {selectedNotification && (
                    <div className="mt-2 text-xs text-slate-400">
                      {formatTemplateKey(
                        selectedNotification.templateKey,
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    closeDetails
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close notification details"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12" />
                    <path d="m18 6-12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {detailLoading && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      className="opacity-25"
                      stroke="currentColor"
                      strokeWidth="3"
                    />

                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>

                  Loading notification
                  details...
                </div>
              )}

              {detailError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />

                    <path d="M12 8v5" />

                    <path d="M12 16h.01" />
                  </svg>

                  <span>{detailError}</span>
                </div>
              )}

              {selectedNotification && (
                <>
                  {/* Status header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusTone(
                        selectedNotification.status,
                      )}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                          selectedNotification.status,
                        )}`}
                      />

                      {formatLabel(
                        selectedNotification.status,
                      )}
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getChannelTone(
                        selectedNotification.channel,
                      )}`}
                    >
                      {getChannelIcon(
                        selectedNotification.channel,
                      )}

                      {formatLabel(
                        selectedNotification.channel,
                      )}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                      {getNotificationTypeLabel(
                        selectedNotification,
                      )}
                    </span>

                    {isRetryable(
                      selectedNotification,
                    ) && (
                      <button
                        type="button"
                        disabled={
                          retryingId ===
                          selectedNotification.id
                        }
                        onClick={() =>
                          void handleRetry(
                            selectedNotification,
                          )
                        }
                        className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {retryingId ===
                        selectedNotification.id ? (
                          <>
                            <svg
                              className="h-3.5 w-3.5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="9"
                                className="opacity-25"
                                stroke="currentColor"
                                strokeWidth="3"
                              />

                              <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="3"
                              />
                            </svg>

                            Retrying...
                          </>
                        ) : (
                          "Retry Notification"
                        )}
                      </button>
                    )}
                  </div>

                  {/* Overview */}
                  <InfoCard title="Overview">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field
                        label="Subject"
                        value={
                          selectedNotification.subject ??
                          getNotificationTypeLabel(
                            selectedNotification,
                          )
                        }
                      />

                      <Field
                        label="Notification Type"
                        value={getNotificationTypeLabel(
                          selectedNotification,
                        )}
                      />

                      <Field
                        label="Channel"
                        value={formatLabel(
                          selectedNotification.channel,
                        )}
                      />

                      <Field
                        label="Template"
                        value={formatTemplateKey(
                          selectedNotification.templateKey,
                        )}
                      />
                    </div>
                  </InfoCard>

                  {/* Recipient */}
                  <InfoCard title="Recipient">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field
                        label="Member"
                        value={getMemberName(
                          selectedNotification,
                        )}
                      />

                      <Field
                        label="Member Number"
                        value={
                          selectedNotification
                            .member
                            ?.memberNumber ??
                          getMetadataString(
                            selectedNotification,
                            "memberNumber",
                          ) ??
                          "—"
                        }
                      />

                      <Field
                        label="Email"
                        value={
                          selectedNotification
                            .member
                            ?.email ??
                          selectedNotification
                            .user
                            ?.email ??
                          "—"
                        }
                      />

                      <Field
                        label="Phone"
                        value={
                          selectedNotification
                            .member
                            ?.phone ??
                          selectedNotification
                            .user
                            ?.phone ??
                          "—"
                        }
                      />
                    </div>
                  </InfoCard>

                  {/* Delivery */}
                  <InfoCard title="Delivery">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field
                        label="Recipient"
                        value={
                          selectedNotification.recipient
                        }
                      />

                      <Field
                        label="Attempts"
                        value={`${selectedNotification.attempts} ${
                          selectedNotification.attempts ===
                          1
                            ? "attempt"
                            : "attempts"
                        }`}
                      />

                      <Field
                        label="Created"
                        value={formatDateTime(
                          selectedNotification.createdAt,
                        )}
                      />

                      <Field
                        label="Updated"
                        value={formatDateTime(
                          selectedNotification.updatedAt,
                        )}
                      />

                      <Field
                        label="Sent"
                        value={formatDateTime(
                          selectedNotification.sentAt,
                        )}
                      />

                      <Field
                        label="Failed"
                        value={formatDateTime(
                          selectedNotification.failedAt,
                        )}
                      />

                      <Field
                        label="Provider Message ID"
                        value={
                          selectedNotification.providerMessageId ??
                          "—"
                        }
                      />

                      <Field
                        label="Notification ID"
                        value={
                          selectedNotification.id
                        }
                      />
                    </div>
                  </InfoCard>

                  {/* Provider */}
                  <InfoCard title="Provider Information">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <MetadataField
                        label="Provider Status"
                        value={getProviderStatus(
                          selectedNotification,
                        )}
                      />

                      <MetadataField
                        label="Provider Cost"
                        value={getProviderCost(
                          selectedNotification,
                        )}
                      />

                      <MetadataField
                        label="Provider Number"
                        value={
                          selectedMetadata.smsProviderNumber ??
                          null
                        }
                      />

                      <MetadataField
                        label="Provider Response"
                        value={
                          selectedMetadata.smsProviderMessage ??
                          null
                        }
                      />
                    </div>
                  </InfoCard>

                  {/* Error */}
                  {selectedNotification.errorMessage && (
                    <InfoCard title="Error">
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              aria-hidden="true"
                            >
                              <path d="M12 9v4" />
                              <path d="M12 17h.01" />
                              <path d="M10.3 4.7 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs font-black uppercase tracking-[0.12em] text-red-500">
                              Delivery error
                            </div>

                            <div className="mt-1 break-words text-sm leading-6 text-red-700">
                              {
                                selectedNotification.errorMessage
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </InfoCard>
                  )}

                  {/* SMS Content */}
                  {typeof selectedMetadata.smsText ===
                    "string" && (
                    <InfoCard title="SMS Content">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                            {getChannelIcon(
                              "SMS",
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                              Message
                            </div>

                            <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                              {
                                selectedMetadata.smsText
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </InfoCard>
                  )}

                  {/* Email Content */}
                  {typeof selectedMetadata.emailText ===
                    "string" && (
                    <InfoCard title="Email Content">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                          Plain-text email
                        </div>

                        <div className="mt-2 max-h-72 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {
                            selectedMetadata.emailText
                          }
                        </div>
                      </div>
                    </InfoCard>
                  )}

                  {/* Notification metadata */}
                  <InfoCard title="Notification Metadata">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <MetadataField
                        label="Category"
                        value={
                          selectedMetadata.category
                        }
                      />

                      <MetadataField
                        label="Member Number"
                        value={
                          selectedMetadata.memberNumber
                        }
                      />

                      <MetadataField
                        label="Provider Status"
                        value={getProviderStatus(
                          selectedNotification,
                        )}
                      />

                      <MetadataField
                        label="Provider Cost"
                        value={getProviderCost(
                          selectedNotification,
                        )}
                      />

                      <MetadataField
                        label="SMS Provider Number"
                        value={
                          selectedMetadata.smsProviderNumber
                        }
                      />

                      <MetadataField
                        label="SMS Provider Status"
                        value={
                          selectedMetadata.smsProviderStatus
                        }
                      />

                      <MetadataField
                        label="SMS Provider Cost"
                        value={
                          selectedMetadata.smsProviderCost
                        }
                      />

                      <MetadataField
                        label="SMS Provider Message"
                        value={
                          selectedMetadata.smsProviderMessage
                        }
                      />
                    </div>
                  </InfoCard>

                  {/* Identifiers */}
                  <InfoCard title="Identifiers">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field
                        label="Notification ID"
                        value={
                          selectedNotification.id
                        }
                      />

                      <Field
                        label="Member ID"
                        value={
                          selectedNotification.memberId ??
                          "—"
                        }
                      />

                      <Field
                        label="User ID"
                        value={
                          selectedNotification.userId ??
                          "—"
                        }
                      />

                      <Field
                        label="Organization ID"
                        value={
                          selectedNotification.organizationId
                        }
                      />
                    </div>
                  </InfoCard>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}