"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

type UserRole = {
  id: string;
  name: string;
  code: string;
};

type UserOrganization = {
  id: string;
  name: string;
  code: string;
};

type UserMember = {
  id: string;
  registrationNumber?: string | null;
  memberNumber: string;
  status: string;
};

type UserRecord = {
  id: string;
  organizationId: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "LOCKED" | string;
  isSystemOwner: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: UserOrganization | null;
  member?: UserMember | null;
  roles: UserRole[];
};

type CreateUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
};

type RoleRecord = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isSystemRole?: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const emptyForm: CreateUserForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  roleId: "",
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
      const message =
        (
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
        "You do not have permission to perform this action.",
      );
    }

    throw new Error(
      `Request failed with status ${response.status}.`,
    );
  }

  return data as T;
}

function normalizeUsers(
  data: unknown,
): UserRecord[] {
  let source = data;

  if (
    source &&
    typeof source === "object" &&
    "data" in source
  ) {
    source = (
      source as {
        data?: unknown;
      }
    ).data;
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source.filter(
    (
      user,
    ): user is UserRecord =>
      Boolean(
        user &&
          typeof user === "object" &&
          "id" in user &&
          "email" in user,
      ),
  ).map((user) => {
    const record =
      user as Partial<UserRecord>;

    return {
      id: record.id ?? "",
      organizationId:
        record.organizationId ?? "",
      firstName:
        record.firstName ?? null,
      lastName:
        record.lastName ?? null,
      email: record.email ?? "",
      status: record.status ?? "INACTIVE",
      isSystemOwner:
        record.isSystemOwner ?? false,
      lastLoginAt:
        record.lastLoginAt ?? null,
      createdAt:
        record.createdAt ?? "",
      updatedAt:
        record.updatedAt ?? "",
      organization:
        record.organization ?? null,
      member: record.member ?? null,
      roles: Array.isArray(record.roles)
        ? record.roles
        : [],
    };
  });
}

function normalizeRoles(
  data: unknown,
): RoleRecord[] {
  let source = data;

  if (
    source &&
    typeof source === "object" &&
    "data" in source
  ) {
    source = (
      source as {
        data?: unknown;
      }
    ).data;
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .filter(
      (
        role,
      ): role is Record<
        string,
        unknown
      > =>
        Boolean(
          role &&
            typeof role === "object",
        ),
    )
    .map((role) => ({
      id:
        typeof role.id === "string"
          ? role.id
          : "",
      name:
        typeof role.name === "string"
          ? role.name
          : typeof role.code === "string"
            ? role.code
            : "Unknown Role",
      code:
        typeof role.code === "string"
          ? role.code
          : "",
      description:
        typeof role.description ===
        "string"
          ? role.description
          : null,
      isSystemRole:
        typeof role.isSystemRole ===
        "boolean"
          ? role.isSystemRole
          : undefined,
    }))
    .filter((role) => role.id);
}

function getRoleTone(
  role: UserRole,
) {
  const normalized =
    role.name.toLowerCase();

  if (
    normalized.includes("owner") ||
    normalized.includes("super administrator")
  ) {
    return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
  }

  if (
    normalized.includes("administrator") ||
    normalized.includes("admin")
  ) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (
    normalized.includes("executive")
  ) {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  if (
    normalized.includes("member")
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getStatusTone(
  status: string,
) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700";

    case "SUSPENDED":
      return "bg-amber-50 text-amber-700";

    case "LOCKED":
      return "bg-red-50 text-red-700";

    case "INACTIVE":
    default:
      return "bg-slate-100 text-slate-500";
  }
}

function formatStatus(
  status: string,
) {
  const normalized =
    status.toLowerCase();

  return normalized
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-KE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
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

function fullName(
  user: UserRecord,
) {
  const name = [
    user.firstName,
    user.lastName,
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(
          value?.trim(),
        ),
    )
    .join(" ")
    .trim();

  if (name) {
    return name;
  }

  return user.email || "Unnamed User";
}

function initials(
  user: UserRecord,
) {
  const first =
    user.firstName?.trim()?.[0] ??
    "";

  const last =
    user.lastName?.trim()?.[0] ??
    "";

  const result =
    `${first}${last}`.toUpperCase();

  if (result) {
    return result;
  }

  return (
    user.email?.[0]?.toUpperCase() ??
    "U"
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-sm text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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

export default function UsersWorkspace() {
  const router = useRouter();

  const [users, setUsers] =
    useState<UserRecord[]>([]);

  const [roles, setRoles] =
    useState<RoleRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [rolesLoading, setRolesLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "ALL" |
      "ACTIVE" |
      "INACTIVE" |
      "SUSPENDED" |
      "LOCKED"
    >("ALL");

  const [selectedUser, setSelectedUser] =
    useState<UserRecord | null>(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [detailError, setDetailError] =
    useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [form, setForm] =
    useState<CreateUserForm>(emptyForm);

  const [formError, setFormError] =
    useState("");

  const [formLoading, setFormLoading] =
    useState(false);

  const [actionLoadingId, setActionLoadingId] =
    useState<string | null>(null);

  const loadUsers = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await apiRequest<unknown>(
            "/users",
          );

        setUsers(
          normalizeUsers(data),
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
            : "Unable to load users.",
        );
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const loadRoles = useCallback(
    async () => {
      setRolesLoading(true);

      try {
        const data =
          await apiRequest<unknown>(
            "/roles",
          );

        setRoles(
          normalizeRoles(data),
        );
      } catch (requestError) {
        setError((current) =>
          current ||
          (requestError instanceof Error
            ? requestError.message
            : "Unable to load roles."),
        );
      } finally {
        setRolesLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const filteredUsers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const roleText = user.roles
        .map((role) =>
          `${role.name} ${role.code}`,
        )
        .join(" ");

      const matchesSearch =
        !query ||
        fullName(user)
          .toLowerCase()
          .includes(query) ||
        user.email
          .toLowerCase()
          .includes(query) ||
        roleText
          .toLowerCase()
          .includes(query) ||
        (
          user.member
            ?.memberNumber ?? ""
        )
          .toLowerCase()
          .includes(query) ||
        (
          user.member
            ?.registrationNumber ?? ""
        )
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    search,
    statusFilter,
    users,
  ]);

  const stats = useMemo(
    () => ({
      total: users.length,

      active: users.filter(
        (user) =>
          user.status ===
          "ACTIVE",
      ).length,

      inactive: users.filter(
        (user) =>
          user.status ===
          "INACTIVE",
      ).length,

      suspended: users.filter(
        (user) =>
          user.status ===
          "SUSPENDED",
      ).length,

      locked: users.filter(
        (user) =>
          user.status ===
          "LOCKED",
      ).length,
    }),
    [users],
  );

  async function openUser(
    userId: string,
  ) {
    setDetailLoading(true);
    setDetailError("");

    try {
      const data =
        await apiRequest<UserRecord>(
          `/users/${userId}`,
        );

      setSelectedUser(
        data,
      );
    } catch (requestError) {
      setDetailError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load user details.",
      );
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleStatusChange(
    user: UserRecord,
  ) {
    const nextStatus =
      user.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    setActionLoadingId(user.id);
    setError("");

    try {
      const updated =
        await apiRequest<UserRecord>(
          `/users/${user.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status: nextStatus,
            }),
          },
        );

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? updated
            : item,
        ),
      );

      if (
        selectedUser?.id === user.id
      ) {
        setSelectedUser(
          updated,
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update user status.",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  function openCreate() {
    const preferredRole =
      roles.find(
        (role) =>
          role.code ===
          "MEMBER",
      ) ??
      roles.find(
        (role) =>
          role.name
            .toLowerCase() ===
          "member",
      ) ??
      roles[0];

    setForm({
      ...emptyForm,
      roleId:
        preferredRole?.id ?? "",
    });

    setFormError("");
    setShowCreate(true);
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setFormError("");
    setFormLoading(true);

    try {
      await apiRequest(
        "/users",
        {
          method: "POST",
          body: JSON.stringify({
            firstName:
              form.firstName.trim(),

            lastName:
              form.lastName.trim(),

            email:
              form.email.trim(),

            password:
              form.password,

            ...(form.roleId
              ? {
                  roleId:
                    form.roleId,
                }
              : {}),
          }),
        },
      );

      setShowCreate(false);
      setForm(emptyForm);

      await loadUsers();
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create user.",
      );
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-medium text-slate-400">
            Administration
          </div>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage KUHRSA system users,
            account status, roles and
            organizational access.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          + Create User
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Users"
          value={stats.total}
          detail="All registered system users"
        />

        <StatCard
          label="Active"
          value={stats.active}
          detail="Currently enabled accounts"
        />

        <StatCard
          label="Inactive"
          value={stats.inactive}
          detail="Currently disabled accounts"
        />

        <StatCard
          label="Suspended"
          value={stats.suspended}
          detail="Temporarily suspended"
        />

        <StatCard
          label="Locked"
          value={stats.locked}
          detail="Security-locked accounts"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="w-full max-w-xl">
            <label
              htmlFor="user-search"
              className="sr-only"
            >
              Search users
            </label>

            <input
              id="user-search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by name, email, member number or role..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ALL", "All Users"],
                ["ACTIVE", "Active"],
                ["INACTIVE", "Inactive"],
                ["SUSPENDED", "Suspended"],
                ["LOCKED", "Locked"],
              ] as const
            ).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      value,
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    statusFilter ===
                    value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">
                  User
                </th>

                <th className="px-5 py-3 font-semibold">
                  Contact
                </th>

                <th className="px-5 py-3 font-semibold">
                  Roles
                </th>

                <th className="px-5 py-3 font-semibold">
                  Status
                </th>

                <th className="px-5 py-3 font-semibold">
                  Created
                </th>

                <th className="px-5 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No users match the
                    current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                            {initials(
                              user,
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                              {fullName(
                                user,
                              )}
                            </div>

                            <div className="truncate text-xs text-slate-400">
                              {user.member
                                ?.memberNumber ??
                                user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-sm text-slate-700">
                          {user.email}
                        </div>

                        <div className="text-xs text-slate-400">
                          {user.member
                            ?.registrationNumber ??
                            "No registration number"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles.length >
                          0 ? (
                            user.roles.map(
                              (role) => (
                                <span
                                  key={
                                    role.id
                                  }
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getRoleTone(
                                    role,
                                  )}`}
                                >
                                  {
                                    role.name
                                  }
                                </span>
                              ),
                            )
                          ) : (
                            <span className="text-xs text-slate-400">
                              No role
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusTone(
                            user.status,
                          )}`}
                        >
                          {formatStatus(
                            user.status,
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(
                          user.createdAt,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void openUser(
                                user.id,
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </button>

                          {!user.isSystemOwner && (
                            <button
                              type="button"
                              disabled={
                                actionLoadingId ===
                                user.id
                              }
                              onClick={() =>
                                void handleStatusChange(
                                  user,
                                )
                              }
                              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                                user.status ===
                                "ACTIVE"
                                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {actionLoadingId ===
                              user.id
                                ? "Saving..."
                                : user.status ===
                                    "ACTIVE"
                                  ? "Deactivate"
                                  : "Activate"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Create User
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a system account
                  and assign its initial
                  role.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreate(false)
                }
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    First name
                  </label>

                  <input
                    id="first-name"
                    required
                    value={
                      form.firstName
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          firstName:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Last name
                  </label>

                  <input
                    id="last-name"
                    required
                    value={
                      form.lastName
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          lastName:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          email:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={
                      form.password
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          password:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="role"
                    className="text-sm font-medium text-slate-700"
                  >
                    Initial role
                  </label>

                  <select
                    id="role"
                    required
                    disabled={
                      rolesLoading
                    }
                    value={
                      form.roleId
                    }
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          roleId:
                            event.target
                              .value,
                        }),
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">
                      {rolesLoading
                        ? "Loading roles..."
                        : "Select role"}
                    </option>

                    {roles.map(
                      (role) => (
                        <option
                          key={role.id}
                          value={
                            role.id
                          }
                        >
                          {role.name}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    formLoading ||
                    rolesLoading ||
                    !form.roleId
                  }
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {formLoading
                    ? "Creating..."
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(selectedUser ||
        detailLoading ||
        detailError) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <div className="text-sm font-medium text-slate-400">
                  User Details
                </div>

                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  {selectedUser
                    ? fullName(
                        selectedUser,
                      )
                    : "Loading..."}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser(
                    null,
                  );
                  setDetailError("");
                }}
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 p-6">
              {detailLoading && (
                <div className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  Loading user details...
                </div>
              )}

              {detailError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {detailError}
                </div>
              )}

              {selectedUser && (
                <>
                  <InfoCard title="Account">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Name"
                        value={fullName(
                          selectedUser,
                        )}
                      />

                      <Field
                        label="Email"
                        value={
                          selectedUser.email
                        }
                      />

                      <Field
                        label="Status"
                        value={formatStatus(
                          selectedUser.status,
                        )}
                      />

                      <Field
                        label="System Owner"
                        value={
                          selectedUser.isSystemOwner
                            ? "Yes"
                            : "No"
                        }
                      />

                      <Field
                        label="User ID"
                        value={
                          selectedUser.id
                        }
                      />

                      <Field
                        label="Organization"
                        value={
                          selectedUser
                            .organization
                            ?.name ?? "—"
                        }
                      />

                      <Field
                        label="Last Login"
                        value={formatDateTime(
                          selectedUser.lastLoginAt,
                        )}
                      />

                      <Field
                        label="Created"
                        value={formatDateTime(
                          selectedUser.createdAt,
                        )}
                      />

                      <Field
                        label="Updated"
                        value={formatDateTime(
                          selectedUser.updatedAt,
                        )}
                      />
                    </div>
                  </InfoCard>

                  <InfoCard title="System Roles">
                    {selectedUser.roles
                      .length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.roles.map(
                          (role) => (
                            <span
                              key={role.id}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${getRoleTone(
                                role,
                              )}`}
                            >
                              {
                                role.name
                              }
                            </span>
                          ),
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        No system roles
                        assigned.
                      </div>
                    )}
                  </InfoCard>

                  <InfoCard title="Membership">
                    {selectedUser.member ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Member Number"
                          value={
                            selectedUser
                              .member
                              .memberNumber
                          }
                        />

                        <Field
                          label="Registration Number"
                          value={
                            selectedUser
                              .member
                              .registrationNumber ??
                            "—"
                          }
                        />

                        <Field
                          label="Member Status"
                          value={formatStatus(
                            selectedUser
                              .member
                              .status,
                          )}
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        This user is not
                        currently linked to a
                        KUHRSA member record.
                      </div>
                    )}
                  </InfoCard>

                  <InfoCard title="Organization">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Organization"
                        value={
                          selectedUser
                            .organization
                            ?.name ?? "—"
                        }
                      />

                      <Field
                        label="Organization Code"
                        value={
                          selectedUser
                            .organization
                            ?.code ?? "—"
                        }
                      />

                      <Field
                        label="Organization ID"
                        value={
                          selectedUser
                            .organization
                            ?.id ??
                          selectedUser.organizationId
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