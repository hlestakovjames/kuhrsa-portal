"use client";

import Link from "next/link";
import type { AuthUser } from "@/lib/auth";

type MembershipView =
  | "overview"
  | "profile"
  | "status"
  | "number"
  | "card"
  | "qr"
  | "history"
  | "activation"
  | "renewal"
  | "verification";

type MemberRecord = {
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
  organization: { id: string; name: string; code: string } | null;
  membershipPeriod: {
    id: string;
    membershipYear: string;
    startsAt: string;
    endsAt: string;
    status: string;
    activatedAt: string | null;
  } | null;
};

type Props = {
  view: MembershipView;
  user: AuthUser;
  member: MemberRecord | null;
};

function label(value?: string | null) {
  if (!value) return "Not available";
  return value.toLowerCase().replace(/_/g, " ").replace(/\\b\\w/g, (letter) => letter.toUpperCase());
}

function value(valueToShow?: string | number | null) {
  return valueToShow === null || valueToShow === undefined || valueToShow === ""
    ? "Not available"
    : String(valueToShow);
}

function date(valueToFormat?: string | null) {
  if (!valueToFormat) return "Not available";
  const parsed = new Date(valueToFormat);
  return Number.isNaN(parsed.getTime())
    ? "Not available"
    : parsed.toLocaleDateString("en-KE", { day: "2-digit", month: "long", year: "numeric" });
}

function InfoTile({ label: title, value: content }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-[#F8FBFC] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">{title}</p>
      <p className="mt-2 break-words text-sm font-bold text-[#0B2633]">{content}</p>
    </div>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">My Membership</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">{description}</p>
    </section>
  );
}

function Unavailable({ title, detail }: { title: string; detail: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
      <h2 className="text-sm font-black text-[#0B2633]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-black/50">{detail}</p>
    </section>
  );
}

export default function MemberMembershipWorkspace({ view, user, member }: Props) {
  const fullName = [user.firstName, user.middleName, user.lastName]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ");
  const period = member?.membershipPeriod;

  const titles: Record<MembershipView, { title: string; description: string }> = {
    overview: { title: "Membership Overview", description: "Your current membership record and the latest membership period returned by KUHRSA." },
    profile: { title: "Membership Profile", description: "Personal and academic details from your linked KUHRSA member record." },
    status: { title: "Membership Status", description: "Your current membership and compliance status." },
    number: { title: "Membership Number", description: "Your unique KUHRSA membership identifier." },
    card: { title: "Membership Card", description: "A digital membership card using the details held in your current member record." },
    qr: { title: "Membership QR Code", description: "QR verification will be available when a secure member QR endpoint is provided." },
    history: { title: "Membership History", description: "The current dashboard API returns the latest membership period only." },
    activation: { title: "Membership Activation", description: "Your current activation state from the member record." },
    renewal: { title: "Membership Renewal", description: "Your current membership period and its dates. No future renewal date is assumed." },
    verification: { title: "Member Verification", description: "The current membership record status and compliance fields." },
  };

  if (!member) {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header title={titles[view].title} description={titles[view].description} />
        <Unavailable title="Membership record not linked" detail="The authenticated account does not currently have a linked member record. Membership information cannot be displayed until the record is linked by KUHRSA administration." />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Header title={titles[view].title} description={titles[view].description} />

      {view === "overview" && (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile label="Membership number" value={member.memberNumber} />
            <InfoTile label="Member category" value={label(member.category)} />
            <InfoTile label="Membership status" value={label(member.status)} />
            <InfoTile label="Activation status" value={label(member.activationStatus)} />
          </section>
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoTile label="Good standing" value={label(member.goodStandingStatus)} />
            <InfoTile label="Financial status" value={label(member.financialStatus)} />
            <InfoTile label="Disciplinary status" value={label(member.disciplinaryStatus)} />
            <InfoTile label="Constitutional category" value={label(member.constitutionalCategory)} />
          </section>
          {period ? (
            <section className="mt-6 rounded-2xl bg-[#0B2633] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">Latest membership period</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div><p className="text-xs text-white/45">Membership year</p><p className="mt-1 text-sm font-bold">{period.membershipYear}</p></div>
                <div><p className="text-xs text-white/45">Starts</p><p className="mt-1 text-sm font-bold">{date(period.startsAt)}</p></div>
                <div><p className="text-xs text-white/45">Ends</p><p className="mt-1 text-sm font-bold">{date(period.endsAt)}</p></div>
              </div>
            </section>
          ) : <Unavailable title="No membership period recorded" detail="The backend has not returned a membership period for this member." />}
          <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/membership/card" className="rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-bold text-[#0B2633] hover:border-[#168DB8]/30">Digital membership card</Link>
            <Link href="/dashboard/membership/history" className="rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-bold text-[#0B2633] hover:border-[#168DB8]/30">Membership period</Link>
            <Link href="/dashboard/membership/verification" className="rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-bold text-[#0B2633] hover:border-[#168DB8]/30">Verification status</Link>
          </section>
        </>
      )}

      {view === "profile" && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoTile label="First name" value={value(user.firstName)} />
          <InfoTile label="Middle name" value={value(user.middleName)} />
          <InfoTile label="Last name" value={value(user.lastName)} />
          <InfoTile label="Email" value={user.email} />
          <InfoTile label="Phone" value={value(member.phone ?? user.phone)} />
          <InfoTile label="Member number" value={member.memberNumber} />
          <InfoTile label="Registration number" value={value(member.registrationNumber)} />
          <InfoTile label="Admission number" value={value(member.admissionNumber)} />
          <InfoTile label="Programme" value={value(member.programme)} />
          <InfoTile label="Year of study" value={value(member.yearOfStudy)} />
          <InfoTile label="Faculty / school" value={value(member.faculty)} />
          <InfoTile label="Department" value={value(member.department)} />
          <InfoTile label="Position" value={value(member.position)} />
          <InfoTile label="County" value={value(member.county)} />
          <InfoTile label="Address" value={value(member.address)} />
        </section>
      )}

      {view === "status" && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoTile label="Membership status" value={label(member.status)} />
          <InfoTile label="Activation status" value={label(member.activationStatus)} />
          <InfoTile label="Good standing" value={label(member.goodStandingStatus)} />
          <InfoTile label="Financial status" value={label(member.financialStatus)} />
          <InfoTile label="Disciplinary status" value={label(member.disciplinaryStatus)} />
          <InfoTile label="Latest period status" value={label(period?.status)} />
          <InfoTile label="Period starts" value={date(period?.startsAt)} />
          <InfoTile label="Period ends" value={date(period?.endsAt)} />
        </section>
      )}

      {view === "number" && (
        <section className="mt-6 rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#168DB8]">Your membership number</p>
          <p className="mt-5 break-all text-3xl font-black tracking-tight text-[#0B2633] sm:text-4xl">{member.memberNumber}</p>
          <p className="mt-3 text-sm text-black/45">{label(member.category)} member</p>
        </section>
      )}

      {view === "card" && (
        <section className="mt-6 max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2633] to-[#124861] p-7 text-white shadow-[0_18px_50px_rgba(11,38,51,0.14)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">KUHRSA</p><h2 className="mt-2 text-xl font-black">Digital Membership Card</h2></div>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{label(member.status)}</span>
          </div>
          <p className="mt-12 text-lg font-black">{fullName || "Member name not available"}</p>
          <p className="mt-1 text-xs text-white/55">{label(member.category)}</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div><p className="text-[10px] uppercase tracking-wider text-white/45">Member number</p><p className="mt-1 font-bold">{member.memberNumber}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-white/45">Valid until</p><p className="mt-1 font-bold">{date(period?.endsAt)}</p></div>
          </div>
          <p className="mt-6 text-[10px] leading-5 text-white/40">This display is based on your current member record. It is not a scannable credential or proof of identity.</p>
        </section>
      )}

      {view === "qr" && <Unavailable title="Secure QR code not available" detail="The current backend does not expose a member-specific QR credential or verification token. A decorative QR image is intentionally not shown." />}

      {view === "history" && (
        period ? (
          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <h2 className="text-lg font-black text-[#0B2633]">Latest recorded period</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoTile label="Membership year" value={period.membershipYear} />
              <InfoTile label="Status" value={label(period.status)} />
              <InfoTile label="Start date" value={date(period.startsAt)} />
              <InfoTile label="End date" value={date(period.endsAt)} />
            </div>
            <p className="mt-4 text-xs leading-5 text-black/40">The current dashboard endpoint returns only the latest period. Earlier membership periods are not available through this response.</p>
          </section>
        ) : <Unavailable title="Membership history unavailable" detail="No membership period is linked to this record yet." />
      )}

      {view === "activation" && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoTile label="Activation status" value={label(member.activationStatus)} />
          <InfoTile label="Membership status" value={label(member.status)} />
          <InfoTile label="Activation completed" value={date(period?.activatedAt)} />
          <InfoTile label="Member source" value={label(member.source)} />
        </section>
      )}

      {view === "renewal" && (
        period ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoTile label="Current membership year" value={period.membershipYear} />
            <InfoTile label="Current period status" value={label(period.status)} />
            <InfoTile label="Period starts" value={date(period.startsAt)} />
            <InfoTile label="Period ends" value={date(period.endsAt)} />
          </section>
        ) : <Unavailable title="Renewal information unavailable" detail="There is no membership period to use for renewal information. The dashboard does not assume a renewal window or next due date." />
      )}

      {view === "verification" && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoTile label="Membership record" value={label(member.status)} />
          <InfoTile label="Member number" value={member.memberNumber} />
          <InfoTile label="Activation" value={label(member.activationStatus)} />
          <InfoTile label="Good standing" value={label(member.goodStandingStatus)} />
          <InfoTile label="Financial status" value={label(member.financialStatus)} />
          <InfoTile label="Disciplinary status" value={label(member.disciplinaryStatus)} />
          <InfoTile label="Registration number" value={value(member.registrationNumber)} />
          <InfoTile label="Staff number" value={value(member.staffNumber)} />
          <p className="sm:col-span-2 rounded-xl bg-[#F8FBFC] p-4 text-xs leading-5 text-black/45">The backend does not currently return a verification result, verifier identity or verification timestamp for this self-service view.</p>
        </section>
      )}
    </div>
  );
}
