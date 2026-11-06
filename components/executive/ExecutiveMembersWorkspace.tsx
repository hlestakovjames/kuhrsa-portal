"use client";

import { useEffect, useMemo, useState } from "react";
import { getToken } from "@/lib/auth";

type ExecutiveMemberRecord = {
  id: string;
  memberNumber: string;
  category: string;
  status: string;
  activationStatus: string;
  email?: string | null;
  programme?: string | null;
  faculty?: string | null;
  department?: string | null;
  user?: {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    email?: string | null;
    status?: string | null;
  } | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "http://localhost:3001";

function label(value?: string | null) {
  if (!value) return "—";
  return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function memberName(member: ExecutiveMemberRecord) {
  const name = [member.user?.firstName, member.user?.middleName, member.user?.lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ");
  return name || member.email || member.user?.email || "Unnamed member";
}

export default function ExecutiveMembersWorkspace() {
  const [members, setMembers] = useState<ExecutiveMemberRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMembers() {
      setLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        if (active) {
          setError("Your session is unavailable. Sign in again to continue.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/members`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const message = Array.isArray(payload?.message)
            ? payload.message.join(", ")
            : payload?.message;
          if (response.status === 403) {
            throw new Error("Your executive account does not currently have permission to view the member directory.");
          }
          throw new Error(message || "The member directory could not be loaded.");
        }

        if (!Array.isArray(payload)) {
          throw new Error("The membership service returned an unexpected response.");
        }

        if (active) setMembers(payload as ExecutiveMemberRecord[]);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "The member directory could not be loaded.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadMembers();
    return () => {
      active = false;
    };
  }, []);

  const filteredMembers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return members;
    return members.filter((member) => [
      memberName(member),
      member.memberNumber,
      member.registrationNumber,
      member.email,
      member.user?.email,
      member.category,
      member.programme,
      member.department,
      member.faculty,
    ].some((value) => String(value ?? "").toLowerCase().includes(term)));
  }, [members, query]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="rounded-[2rem] bg-[#0B2633] p-6 text-white shadow-sm sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#61C7E9]">Executive workspace · Membership</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Member directory</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Read-only member lookup for authorized executive duties. Membership records remain managed by the Membership and Administration teams.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">Directory records</p>
            <p className="mt-1 text-2xl font-black">{loading ? "…" : members.length}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
        <label htmlFor="executive-member-search" className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Search members</label>
        <input
          id="executive-member-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, member number, email, programme or department"
          className="mt-2 w-full rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm text-[#0B2633] outline-none transition focus:border-[#168DB8] focus:ring-2 focus:ring-[#168DB8]/10"
        />
        <p className="mt-2 text-xs text-black/40">{loading ? "Loading membership records…" : `${filteredMembers.length} matching member${filteredMembers.length === 1 ? "" : "s"}`}</p>
      </section>

      {error && (
        <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800">{error}</div>
      )}

      {!error && !loading && filteredMembers.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center text-sm text-black/45">
          {members.length === 0 ? "No member records are available." : "No members match your search."}
        </div>
      )}

      {!error && filteredMembers.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#F4FAFC]">
                <tr className="text-[10px] font-black uppercase tracking-[0.13em] text-black/40">
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Member number</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Programme / Department</th>
                  <th className="px-5 py-4">Membership status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-t border-black/[0.05]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#0B2633]">{memberName(member)}</p>
                      <p className="mt-1 text-xs text-black/40">{member.email || member.user?.email || "No email recorded"}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#0B2633]">{member.memberNumber}</td>
                    <td className="px-5 py-4 text-sm text-black/60">{label(member.category)}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#0B2633]">{member.programme || member.position || "—"}</p>
                      <p className="mt-1 text-xs text-black/40">{member.department || member.faculty || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#168DB8]/10 px-3 py-1.5 text-[10px] font-black uppercase text-[#11799D]">{label(member.status)}</span>
                      <p className="mt-1 text-[10px] text-black/40">{label(member.activationStatus)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
