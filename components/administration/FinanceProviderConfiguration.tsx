"use client";

import { useCallback, useEffect, useState } from "react";
import { getToken, logout } from "@/lib/auth";

type ProviderConfiguration = {
  id: string;
  environment: string;
  currency: string;
  shortcode?: string | null;
  tillNumber?: string | null;
  paybillNumber?: string | null;
  enabled: boolean;
  minimumAmount?: number | null;
  maximumAmount?: number | null;
  callbackUrl?: string | null;
};

type PaymentProvider = {
  id: string;
  name: string;
  code: string;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  configurations?: ProviderConfiguration[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "http://localhost:3001";

async function request<T>(path: string, method: "GET" | "POST" | "PATCH" = "GET", body?: unknown): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Your session has expired. Please sign in again.");
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    ...(body === undefined ? { cache: "no-store" as RequestCache } : { body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => null);
  if (response.status === 401) { logout(); throw new Error("Your session has expired. Please sign in again."); }
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message;
    throw new Error(message || "Payment provider settings could not be saved.");
  }
  return data as T;
}

export default function FinanceProviderConfiguration() {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [environment, setEnvironment] = useState("sandbox");
  const [shortcode, setShortcode] = useState("");
  const [tillNumber, setTillNumber] = useState("");
  const [paybillNumber, setPaybillNumber] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [maximumAmount, setMaximumAmount] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const rows = await request<PaymentProvider[]>("/finance/providers");
      setProviders(rows);
      const mpesa = rows.find(item => item.type === "MPESA");
      const config = mpesa?.configurations?.[0];
      if (config) {
        setEnvironment(config.environment);
        setShortcode(config.shortcode ?? "");
        setTillNumber(config.tillNumber ?? "");
        setPaybillNumber(config.paybillNumber ?? "");
        setCallbackUrl(config.callbackUrl ?? "");
        setMinimumAmount(config.minimumAmount == null ? "" : String(config.minimumAmount));
        setMaximumAmount(config.maximumAmount == null ? "" : String(config.maximumAmount));
        setEnabled(config.enabled);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment providers could not be loaded.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const mpesa = providers.find(item => item.type === "MPESA");
  const configuration = mpesa?.configurations?.[0];

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mpesa) return;
    const min = minimumAmount.trim() ? Number(minimumAmount) : undefined;
    const max = maximumAmount.trim() ? Number(maximumAmount) : undefined;
    if ((min !== undefined && (!Number.isFinite(min) || min < 0)) ||
        (max !== undefined && (!Number.isFinite(max) || max < 0)) ||
        (min !== undefined && max !== undefined && min > max)) {
      setError("Enter valid minimum and maximum amounts; minimum cannot exceed maximum.");
      return;
    }
    setSaving(true); setError(null); setSuccess(null);
    const body = {
      environment, currency: "KES", shortcode: shortcode.trim(),
      tillNumber: tillNumber.trim(), paybillNumber: paybillNumber.trim(),
      callbackUrl: callbackUrl.trim(), enabled,
      ...(min === undefined ? {} : { minimumAmount: min }),
      ...(max === undefined ? {} : { maximumAmount: max }),
    };
    try {
      if (configuration) {
        await request(`/finance/providers/${encodeURIComponent(mpesa.id)}/configuration`, "PATCH", body);
      } else {
        await request(`/finance/providers/${encodeURIComponent(mpesa.id)}/configuration`, "POST", body);
      }
      setSuccess("M-Pesa provider configuration saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "M-Pesa configuration could not be saved.");
    } finally { setSaving(false); }
  }

  async function createMpesaProvider() {
    setSaving(true); setError(null); setSuccess(null);
    try {
      await request("/finance/providers", "POST", {
        name: "Safaricom M-Pesa", code: "MPESA", type: "MPESA", isActive: true, isDefault: true,
      });
      setSuccess("M-Pesa provider created. Configure its callback and shortcode below.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "M-Pesa provider could not be created.");
    } finally { setSaving(false); }
  }

  return <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-lg font-black text-[#0B2633]">Payment provider configuration</h2>
      <p className="mt-1 max-w-3xl text-sm text-black/45">Manage the organization’s M-Pesa provider metadata and callback settings. Provider credentials are not displayed or stored in this form.</p></div>
      {mpesa ? <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${mpesa.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{mpesa.isActive ? "Provider active" : "Provider inactive"}</span> : null}
    </div>
    {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
    {success ? <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}
    {loading ? <p className="mt-4 text-sm text-black/45">Loading provider configuration…</p> : !mpesa ? <div className="mt-4"><p className="text-sm text-black/55">No M-Pesa provider is registered for this organization.</p><button type="button" disabled={saving} onClick={() => void createMpesaProvider()} className="mt-3 rounded-xl bg-[#0B2633] px-4 py-3 text-xs font-black text-white disabled:opacity-40">{saving ? "Creating…" : "Register M-Pesa provider"}</button></div> : <>
      <div className="mt-4 rounded-2xl bg-[#F8FBFC] p-4 text-xs text-black/55">
        <p><strong className="text-[#0B2633]">{mpesa.name}</strong> · {mpesa.code} · {mpesa.isDefault ? "Default provider" : "Not default"}</p>
        <p className="mt-1">STK initiation also requires backend deployment variables: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET and MPESA_PASSKEY. These secrets are intentionally not exposed in the portal.</p>
      </div>
      <form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-xs font-bold text-black/60">Environment<select value={environment} onChange={e=>setEnvironment(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm"><option value="sandbox">Sandbox</option><option value="production">Production</option></select></label>
        <label className="text-xs font-bold text-black/60">Business shortcode<input required maxLength={50} value={shortcode} onChange={e=>setShortcode(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
        <label className="text-xs font-bold text-black/60">Till number (optional)<input maxLength={50} value={tillNumber} onChange={e=>setTillNumber(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
        <label className="text-xs font-bold text-black/60">Paybill number (optional)<input maxLength={50} value={paybillNumber} onChange={e=>setPaybillNumber(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
        <label className="text-xs font-bold text-black/60">Callback URL<input required type="url" maxLength={500} value={callbackUrl} onChange={e=>setCallbackUrl(e.target.value)} placeholder="https://…" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
        <label className="text-xs font-bold text-black/60">Minimum amount (KES)<input type="number" min="0" step="0.01" value={minimumAmount} onChange={e=>setMinimumAmount(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
        <label className="text-xs font-bold text-black/60">Maximum amount (KES)<input type="number" min="0" step="0.01" value={maximumAmount} onChange={e=>setMaximumAmount(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-sm" /></label>
        <label className="flex items-center gap-3 text-xs font-bold text-black/60"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)} /> Enable this provider configuration</label>
        <div className="md:col-span-2 xl:col-span-3"><button type="submit" disabled={saving} className="rounded-xl bg-[#0B2633] px-5 py-3 text-xs font-black text-white disabled:opacity-40">{saving ? "Saving…" : configuration ? "Update M-Pesa configuration" : "Create M-Pesa configuration"}</button></div>
      </form>
    </>}
  </section>;
}
