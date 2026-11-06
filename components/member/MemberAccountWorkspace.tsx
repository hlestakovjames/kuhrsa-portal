"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { AuthUser } from "@/lib/auth";
import { getToken } from "@/lib/auth";

type AccountView = "profile" | "security" | "login-history" | "settings";

type MemberProfile = {
  memberNumber: string;
  registrationNumber: string | null;
  admissionNumber: string | null;
  category: string;
  programme: string | null;
  yearOfStudy: number | null;
  faculty: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  county: string | null;
  position: string | null;
};

type Props = {
  view: AccountView;
  user: AuthUser;
  member: MemberProfile | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  "http://localhost:3001";

function valueOrUnavailable(value?: string | number | null) {
  return value === null || value === undefined || value === ""
    ? "Not available"
    : String(value);
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
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">
        Account
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

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#F8FBFC] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

export default function MemberAccountWorkspace({ view, user, member }: Props) {
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [phone, setPhone] = useState(user.phone ?? member?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    const token = getToken();
    if (!token) {
      setSaveError("Your session is unavailable. Sign in again before updating your profile.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/me/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          Array.isArray(payload?.message)
            ? payload.message.join(", ")
            : payload?.message || `Unable to update profile (HTTP ${response.status}).`,
        );
      }

      setFirstName(payload?.firstName ?? firstName.trim());
      setLastName(payload?.lastName ?? lastName.trim());
      setPhone(payload?.phone ?? phone.trim());
      setSaveSuccess("Your account profile has been updated.");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (view === "profile") {
    const fullName = [user.firstName, user.middleName, user.lastName]
      .filter((part): part is string => Boolean(part?.trim()))
      .join(" ");

    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Profile"
          description="Your account and membership details are loaded from your authenticated KUHRSA records."
        />

        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="mb-5">
            <h2 className="text-lg font-black text-[#0B2633]">Account information</h2>
            <p className="mt-1 text-sm text-black/45">Only fields supported by the current self-service profile endpoint can be edited here.</p>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">First name</span>
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} required className="mt-2 w-full rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm font-semibold text-[#0B2633] outline-none focus:border-[#168DB8]" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">Last name</span>
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} required className="mt-2 w-full rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm font-semibold text-[#0B2633] outline-none focus:border-[#168DB8]" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">Phone</span>
                <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm font-semibold text-[#0B2633] outline-none focus:border-[#168DB8]" />
              </label>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">Email</span>
                <p className="mt-2 rounded-xl border border-black/[0.06] bg-black/[0.03] px-4 py-3 text-sm font-semibold text-black/55">{user.email}</p>
                <p className="mt-1 text-[11px] text-black/35">Email changes are not supported by the current self-service endpoint.</p>
              </div>
            </div>

            {saveError && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{saveError}</p>}
            {saveSuccess && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{saveSuccess}</p>}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-black/40">Account name: {fullName || "Not available"}</p>
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0B2633] px-5 py-3 text-sm font-black text-white transition hover:bg-[#143B4B] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <h2 className="text-lg font-black text-[#0B2633]">Membership information</h2>
          <p className="mt-1 text-sm text-black/45">Read-only fields from your linked member record.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoTile label="Member number" value={valueOrUnavailable(member?.memberNumber)} />
            <InfoTile label="Category" value={valueOrUnavailable(member?.category)} />
            <InfoTile label="Registration number" value={valueOrUnavailable(member?.registrationNumber)} />
            <InfoTile label="Admission number" value={valueOrUnavailable(member?.admissionNumber)} />
            <InfoTile label="Programme" value={valueOrUnavailable(member?.programme)} />
            <InfoTile label="Year of study" value={valueOrUnavailable(member?.yearOfStudy)} />
            <InfoTile label="Faculty / school" value={valueOrUnavailable(member?.faculty)} />
            <InfoTile label="Department" value={valueOrUnavailable(member?.department)} />
            <InfoTile label="Position" value={valueOrUnavailable(member?.position)} />
            <InfoTile label="County" value={valueOrUnavailable(member?.county)} />
            <InfoTile label="Address" value={valueOrUnavailable(member?.address)} />
          </div>
        </section>
      </div>
    );
  }

  if (view === "security") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title="Security" description="Account information currently exposed by the KUHRSA authentication service." />
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoTile label="Account status" value={valueOrUnavailable(user.status)} />
          <InfoTile label="Two-factor authentication" value="Not supported by the current backend" />
          <InfoTile label="Active sessions" value="Not available" />
          <InfoTile label="Password change date" value="Not available" />
        </section>
        <p className="mt-5 rounded-2xl bg-[#F8FBFC] p-5 text-sm leading-6 text-black/50">Password and multi-factor controls are not exposed by the current account API. No sample security values are displayed.</p>
      </div>
    );
  }

  if (view === "login-history") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title="Login History" description="Review sign-in history when an authenticated session-history endpoint becomes available." />
        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
          <p className="text-sm font-bold text-[#0B2633]">Login history is not available yet.</p>
          <p className="mt-2 text-sm leading-6 text-black/45">The current authentication service stores the last login timestamp, but it does not expose a session history with device, browser, IP address or location details.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Header title="Settings" description="Account preferences will appear here when the backend supports storing and retrieving them." />
      <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
        <p className="text-sm font-bold text-[#0B2633]">No saved preferences are available.</p>
        <p className="mt-2 text-sm leading-6 text-black/45">Language, timezone, date format and dashboard display preferences are not currently stored by the account API.</p>
      </section>
    </div>
  );
}
