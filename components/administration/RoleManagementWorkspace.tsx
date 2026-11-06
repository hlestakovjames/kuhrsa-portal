"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getToken, logout } from "@/lib/auth";

type View = "roles" | "permissions";
type Role = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isSystemRole: boolean;
  userCount?: number;
  permissionCount?: number;
};
type RoleDetail = Role & {
  users: Array<{
    id: string;
    email: string;
    status: string;
    isSystemOwner: boolean;
    startsAt: string;
    endsAt: string | null;
    revokedAt: string | null;
    isActive: boolean;
  }>;
  permissions: Array<{ id: string; name: string; code: string; description?: string | null }>;
};
type User = { id: string; firstName?: string | null; lastName?: string | null; email: string; status: string; isSystemOwner?: boolean };
type Permission = { id: string; name: string; code: string; description?: string | null };

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/+$/, "");
const protectedPermission = (code: string) =>
  code.startsWith("users.") ||
  code.startsWith("system.") ||
  [
    "governance.assignments.create",
    "governance.assignments.update",
    "governance.assignments.activate",
    "governance.assignments.end",
    "governance.assignments.revoke",
    "governance.positions.manage",
    "governance.terms.manage",
  ].includes(code);

async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new Error(message || `Request failed (${response.status}).`);
  }
  return data as T;
}

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.06] sm:p-6">{children}</section>;
}
function ActionButton({ children, onClick, disabled = false, tone = "dark" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; tone?: "dark" | "light" | "danger" }) {
  const style = tone === "danger" ? "border border-rose-200 text-rose-700 hover:bg-rose-50" : tone === "light" ? "border border-black/10 text-[#0B2633] hover:bg-black/[0.03]" : "bg-[#0B2633] text-white hover:bg-[#163D4D]";
  return <button type="button" onClick={onClick} disabled={disabled} className={`rounded-xl px-4 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${style}`}>{children}</button>;
}

export default function RoleManagementWorkspace({ view }: { view: View }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [detail, setDetail] = useState<RoleDetail | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const loadRoles = useCallback(async () => {
    const data = await api<Role[]>("/roles");
    setRoles(data);
    setSelectedRoleId((current) => current || data[0]?.id || "");
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    if (!id) { setDetail(null); return; }
    const data = await api<RoleDetail>(`/roles/${encodeURIComponent(id)}`);
    setDetail(data);
    setEditName(data.name);
    setEditDescription(data.description ?? "");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await loadRoles();
      if (view === "permissions") {
        const data = await api<Permission[]>("/permissions");
        setPermissions(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load access configuration.");
    } finally {
      setLoading(false);
    }
  }, [loadRoles, view]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!selectedRoleId) return;
    void loadDetail(selectedRoleId).catch((e) => setError(e instanceof Error ? e.message : "Unable to load role details."));
  }, [selectedRoleId, loadDetail]);

  useEffect(() => {
    if (view !== "roles") return;
    void api<User[]>("/users").then(setUsers).catch(() => setUsers([]));
  }, [view]);

  const assignedPermissionIds = useMemo(
    () => new Set(detail?.permissions.map((p) => p.id) ?? []),
    [detail],
  );

  async function refresh() {
    await loadRoles();
    if (selectedRoleId) await loadDetail(selectedRoleId);
  }

  async function createRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setSuccess("");
    try {
      const created = await api<RoleDetail>("/roles", "POST", {
        name: roleName.trim(),
        code: roleCode.trim().toUpperCase(),
        description: roleDescription.trim(),
      });
      setRoleName(""); setRoleCode(""); setRoleDescription(""); setShowCreate(false);
      await loadRoles();
      setSelectedRoleId(created.id);
      setSuccess("Custom role created.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to create role."); }
    finally { setBusy(false); }
  }

  async function saveRole() {
    if (!detail || detail.isSystemRole) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      await api(`/roles/${encodeURIComponent(detail.id)}`, "PATCH", {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      await refresh(); setSuccess("Role details updated.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update role."); }
    finally { setBusy(false); }
  }

  async function assignUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!detail || !userId) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      await api(`/roles/${encodeURIComponent(detail.id)}/users/${encodeURIComponent(userId)}`, "POST", {
        ...(startsAt ? { startsAt: new Date(startsAt).toISOString() } : {}),
        ...(endsAt ? { endsAt: new Date(endsAt).toISOString() } : {}),
      });
      setUserId(""); setStartsAt(""); setEndsAt("");
      await loadDetail(detail.id); await loadRoles();
      setSuccess("Role assigned. The backend validated the appointment and access limits.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to assign role."); }
    finally { setBusy(false); }
  }

  async function revokeUser(targetUserId: string) {
    if (!detail) return;
    if (!window.confirm("Revoke this role assignment?")) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      await api(`/roles/${encodeURIComponent(detail.id)}/users/${encodeURIComponent(targetUserId)}`, "DELETE");
      await loadDetail(detail.id); await loadRoles(); setSuccess("Role assignment revoked.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to revoke role."); }
    finally { setBusy(false); }
  }

  async function changePermission(permission: Permission, currentlyAssigned: boolean) {
    if (!detail || detail.isSystemRole || protectedPermission(permission.code)) return;
    setBusy(true); setError(""); setSuccess("");
    const path = `/permissions/role/${encodeURIComponent(detail.id)}/${encodeURIComponent(permission.id)}`;
    try {
      await api(path, currentlyAssigned ? "DELETE" : "POST");
      await loadDetail(detail.id); setSuccess(currentlyAssigned ? "Permission removed." : "Permission granted.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update permission."); }
    finally { setBusy(false); }
  }

  const heading = view === "roles" ? "Roles" : "Permissions";
  if (loading) return <div className="space-y-5"><Header title={heading} description="Live role and permission configuration from the KUHRSA backend." /><Panel>Loading access configuration…</Panel></div>;

  return (
    <div className="space-y-6">
      <Header
        title={heading}
        description={view === "roles"
          ? "Manage organization-scoped roles, appointment assignments and access."
          : "Inspect the permission catalogue and manage grants on custom roles. Protected system permissions remain locked."}
      />
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}<button type="button" onClick={() => void load()} className="ml-3 font-black underline">Retry</button></div> : null}
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{success}</div> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(250px,0.8fr)_minmax(0,2fr)]">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-base font-black text-[#0B2633]">Organization roles</h2><p className="mt-1 text-xs text-black/45">{roles.length} configured roles</p></div>
            {view === "roles" ? <ActionButton onClick={() => setShowCreate((v) => !v)} tone="light">New role</ActionButton> : null}
          </div>
          {showCreate ? <form onSubmit={createRole} className="mt-4 space-y-3 rounded-2xl bg-[#F7FAFB] p-4">
            <input required minLength={2} maxLength={100} value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Role name" className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm" />
            <input required minLength={2} maxLength={100} value={roleCode} onChange={(e) => setRoleCode(e.target.value.toUpperCase())} placeholder="ROLE_CODE" className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm" />
            <textarea required maxLength={500} value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} placeholder="Describe this role" className="w-full rounded-xl border bg-white px-3 py-2.5 text-sm" rows={3} />
            <div className="flex gap-2"><ActionButton disabled={busy}>Create role</ActionButton><ActionButton tone="light" onClick={() => setShowCreate(false)}>Close</ActionButton></div>
          </form> : null}
          <div className="mt-4 space-y-2">
            {roles.map((role) => <button key={role.id} type="button" onClick={() => setSelectedRoleId(role.id)} className={`w-full rounded-2xl border p-3 text-left transition ${selectedRoleId === role.id ? "border-[#168DB8] bg-[#168DB8]/5" : "border-black/[0.06] hover:bg-black/[0.02]"}`}>
              <div className="flex items-center justify-between gap-2"><span className="text-sm font-black text-[#0B2633]">{role.name}</span><span className="text-[10px] font-bold text-black/35">{role.isSystemRole ? "SYSTEM" : "CUSTOM"}</span></div>
              <p className="mt-1 text-[10px] text-black/45">{role.code} · {role.userCount ?? 0} users · {role.permissionCount ?? 0} permissions</p>
            </button>)}
          </div>
        </Panel>

        <div className="space-y-5">
          {!detail ? <Panel>Select a role to inspect its configuration.</Panel> : <>
            <Panel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#168DB8]">{detail.isSystemRole ? "Protected system role" : "Custom organization role"}</p><h2 className="mt-1 text-xl font-black text-[#0B2633]">{detail.name}</h2><p className="mt-1 text-xs text-black/45">{detail.code}</p></div>
                <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[10px] font-black text-black/50">{detail.isSystemRole ? "READ ONLY" : "EDITABLE"}</span>
              </div>
              {view === "roles" && !detail.isSystemRole ? <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold text-black/55">Role name<input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm text-[#0B2633]" /></label>
                <label className="text-xs font-bold text-black/55">Description<input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm text-[#0B2633]" /></label>
                <div className="sm:col-span-2"><ActionButton onClick={() => void saveRole()} disabled={busy}>Save role details</ActionButton></div>
              </div> : null}
            </Panel>

            {view === "roles" ? <>
              <Panel>
                <h3 className="text-sm font-black text-[#0B2633]">Assign this role</h3>
                <p className="mt-1 text-xs leading-5 text-black/45">System Owner identities cannot be assigned. Super Administrator and Administrator appointments require their dedicated protected permissions and enforce organization limits.</p>
                <form onSubmit={assignUser} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-black/55 sm:col-span-2">User
                    <select required value={userId} onChange={(e) => setUserId(e.target.value)} className="mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm">
                      <option value="">Select user</option>
                      {users.filter((u) => !u.isSystemOwner && u.status === "ACTIVE").map((u) => <option key={u.id} value={u.id}>{[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email} — {u.email}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-bold text-black/55">Starts at (optional)<input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                  <label className="text-xs font-bold text-black/55">Ends at (required for Administrator and Executive)<input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm" /></label>
                  <div className="sm:col-span-2"><ActionButton disabled={busy || !userId}>Assign role</ActionButton></div>
                </form>
              </Panel>
              <Panel>
                <h3 className="text-sm font-black text-[#0B2633]">Assignments</h3>
                <div className="mt-3 divide-y divide-black/[0.05]">
                  {detail.users.map((u) => <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div><p className="text-sm font-bold text-[#0B2633]">{u.email}</p><p className="mt-1 text-[10px] text-black/45">{u.startsAt ? new Date(u.startsAt).toLocaleString() : "Start not set"} · {u.endsAt ? new Date(u.endsAt).toLocaleString() : "No end date"} · {u.revokedAt ? "Revoked" : u.isActive ? "Active" : "Scheduled / expired"}</p></div>
                    {!detail.isSystemRole || detail.code !== "MEMBER" ? <ActionButton tone="danger" disabled={busy || u.isSystemOwner || Boolean(u.revokedAt) || detail.code === "MEMBER"} onClick={() => void revokeUser(u.id)}>Revoke</ActionButton> : null}
                  </div>)}
                  {detail.users.length === 0 ? <p className="py-4 text-xs text-black/40">No assignments are recorded for this role.</p> : null}
                </div>
              </Panel>
            </> : null}

            {view === "permissions" ? <Panel>
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-black text-[#0B2633]">Permission catalogue</h3><p className="mt-1 text-xs text-black/45">{detail.permissions.length} permissions granted to this role</p></div><span className="text-[10px] font-black text-black/35">{permissions.length} AVAILABLE</span></div>
              <div className="mt-4 divide-y divide-black/[0.05]">
                {permissions.map((permission) => {
                  const assigned = assignedPermissionIds.has(permission.id);
                  const locked = detail.isSystemRole || protectedPermission(permission.code);
                  return <div key={permission.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0"><p className="text-xs font-black text-[#CE26A4]">{permission.code}</p><p className="mt-1 text-xs text-black/50">{permission.description || permission.name}</p></div>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-black/45"><input type="checkbox" checked={assigned} disabled={busy || locked} onChange={() => void changePermission(permission, assigned)} />{locked ? "Protected" : assigned ? "Granted" : "Not granted"}</label>
                  </div>;
                })}
              </div>
            </Panel> : null}
          </>}
        </div>
      </div>
    </div>
  );
}
