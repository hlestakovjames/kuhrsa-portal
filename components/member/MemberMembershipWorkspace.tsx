"use client";

import Link from "next/link";

import { memberMembershipMock } from "@/lib/mock/member-membership";

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

type MemberMembershipWorkspaceProps = {
  view: MembershipView;
};

const mock = memberMembershipMock;

function getViewContent(view: MembershipView) {
  switch (view) {
    case "overview":
      return {
        eyebrow: "My Membership",
        title: "Membership Overview",
        description:
          "View your current KUHRSA membership information, status and membership period.",
      };

    case "profile":
      return {
        eyebrow: "My Membership",
        title: "My Profile",
        description:
          "Review the profile information associated with your KUHRSA membership.",
      };

    case "status":
      return {
        eyebrow: "My Membership",
        title: "Membership Status",
        description:
          "Check the current status and validity of your KUHRSA membership.",
      };

    case "number":
      return {
        eyebrow: "My Membership",
        title: "Membership Number",
        description:
          "Your unique KUHRSA membership identifier.",
      };

    case "card":
      return {
        eyebrow: "My Membership",
        title: "Membership Card",
        description:
          "View your digital KUHRSA membership card.",
      };

    case "qr":
      return {
        eyebrow: "My Membership",
        title: "Membership QR Code",
        description:
          "Access the secure QR reference associated with your membership.",
      };

    case "history":
      return {
        eyebrow: "My Membership",
        title: "Membership History",
        description:
          "View previous KUHRSA membership periods and their status.",
      };

    case "activation":
      return {
        eyebrow: "My Membership",
        title: "Membership Activation",
        description:
          "View the activation state of your KUHRSA member account.",
      };

    case "renewal":
      return {
        eyebrow: "My Membership",
        title: "Membership Renewal",
        description:
          "Review your current membership cycle and renewal information.",
      };

    case "verification":
      return {
        eyebrow: "My Membership",
        title: "Member Verification",
        description:
          "Review the verification status of your KUHRSA membership record.",
      };
  }
}

function statusClass(status: string) {
  if (
    status === "Active" ||
    status === "Current" ||
    status === "Verified" ||
    status === "Activated"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Expired") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-black/[0.04] text-black/55";
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

function ArrowLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm font-bold text-[#0B2633] transition hover:border-[#168DB8]/20 hover:bg-[#168DB8]/5"
    >
      {label}

      <span className="text-[#168DB8] transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

function QrPlaceholder() {
  return (
    <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <div className="grid grid-cols-9 gap-1.5">
        {Array.from({ length: 81 }).map(
          (_, index) => {
            const active =
              index % 3 === 0 ||
              index % 7 === 0 ||
              index === 10 ||
              index === 11 ||
              index === 12 ||
              index === 19 ||
              index === 20 ||
              index === 21 ||
              index === 60 ||
              index === 61 ||
              index === 69 ||
              index === 70;

            return (
              <span
                key={index}
                className={`h-3 w-3 rounded-[1px] ${
                  active
                    ? "bg-[#0B2633]"
                    : "bg-black/[0.04]"
                }`}
              />
            );
          },
        )}
      </div>
    </div>
  );
}

export default function MemberMembershipWorkspace({
  view,
}: MemberMembershipWorkspaceProps) {
  const content = getViewContent(view);

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">
          {content.eyebrow}
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633]">
          {content.title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">
          {content.description}
        </p>
      </section>

      {view === "overview" && (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              label="Membership Type"
              value={
                mock.overview.membershipType
              }
            />

            <InfoTile
              label="Category"
              value={mock.overview.category}
            />

            <InfoTile
              label="Membership Number"
              value={
                mock.overview.membershipNumber
              }
            />

            <InfoTile
              label="Validity"
              value={`${mock.overview.validFrom} – ${mock.overview.validUntil}`}
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                    Current Membership
                  </p>

                  <h2 className="mt-1 text-xl font-black text-[#0B2633]">
                    Membership record
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                    mock.overview.status,
                  )}`}
                >
                  {mock.overview.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoTile
                  label="Registration Number"
                  value={
                    mock.overview
                      .registrationNumber
                  }
                />

                <InfoTile
                  label="Joined On"
                  value={
                    mock.overview.joinedOn
                  }
                />

                <InfoTile
                  label="Valid From"
                  value={
                    mock.overview.validFrom
                  }
                />

                <InfoTile
                  label="Valid Until"
                  value={
                    mock.overview.validUntil
                  }
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Membership Actions
              </p>

              <div className="mt-4 space-y-2">
                <ArrowLink
                  href="/dashboard/membership/card"
                  label="View Membership Card"
                />

                <ArrowLink
                  href="/dashboard/membership/qr"
                  label="Open QR Code"
                />

                <ArrowLink
                  href="/dashboard/membership/history"
                  label="View Membership History"
                />

                <ArrowLink
                  href="/dashboard/membership/verification"
                  label="View Verification"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {view === "profile" && (
        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile
              label="First Name"
              value={mock.profile.firstName}
            />

            <InfoTile
              label="Last Name"
              value={mock.profile.lastName}
            />

            <InfoTile
              label="Email"
              value={mock.profile.email}
            />

            <InfoTile
              label="Phone"
              value={mock.profile.phone}
            />

            <InfoTile
              label="Programme"
              value={mock.profile.programme}
            />

            <InfoTile
              label="Year of Study"
              value={String(
                mock.profile.yearOfStudy,
              )}
            />

            <InfoTile
              label="Faculty"
              value={mock.profile.faculty}
            />

            <InfoTile
              label="Department"
              value={mock.profile.department}
            />
          </div>
        </section>
      )}

      {view === "status" && (
        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Current Status
              </p>

              <p className="mt-3 text-4xl font-black text-[#0B2633]">
                {mock.overview.status}
              </p>

              <p className="mt-2 text-sm text-black/45">
                Your membership is currently within
                its active membership period.
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-black ${statusClass(
                mock.overview.status,
              )}`}
            >
              {mock.overview.statusLabel}
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoTile
              label="Valid From"
              value={mock.overview.validFrom}
            />

            <InfoTile
              label="Valid Until"
              value={mock.overview.validUntil}
            />
          </div>
        </section>
      )}

      {view === "number" && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.55fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#168DB8]">
              Unique Membership Identifier
            </p>

            <p className="mt-5 break-all text-3xl font-black tracking-tight text-[#0B2633] sm:text-4xl">
              {mock.overview.membershipNumber}
            </p>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/45">
              Keep this number available when
              interacting with authorized KUHRSA
              membership services.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <InfoTile
              label="Membership Category"
              value={mock.overview.category}
            />

            <div className="mt-3">
              <InfoTile
                label="Account Status"
                value={mock.overview.status}
              />
            </div>
          </div>
        </section>
      )}

      {view === "card" && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2633] to-[#124861] p-7 text-white shadow-[0_18px_50px_rgba(11,38,51,0.14)] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  KUHRSA
                </p>

                <p className="mt-2 text-xl font-black">
                  Digital Membership Card
                </p>
              </div>

              <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-black text-emerald-300">
                {mock.overview.status}
              </span>
            </div>

            <div className="mt-12">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
                Membership Number
              </p>

              <p className="mt-2 text-xl font-black tracking-wide">
                {mock.overview.membershipNumber}
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
                  Member Type
                </p>

                <p className="mt-1 text-sm font-bold text-white/85">
                  {mock.overview.membershipType}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
                  Valid Until
                </p>

                <p className="mt-1 text-sm font-bold text-white/85">
                  {mock.overview.validUntil}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Card Information
            </p>

            <div className="mt-5 space-y-3">
              <InfoTile
                label="Category"
                value={mock.overview.category}
              />

              <InfoTile
                label="Valid From"
                value={mock.overview.validFrom}
              />

              <InfoTile
                label="Valid Until"
                value={mock.overview.validUntil}
              />

              <InfoTile
                label="Verification"
                value={
                  mock.verification
                    .verificationStatus
                }
              />
            </div>
          </div>
        </section>
      )}

      {view === "qr" && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-black/[0.06] bg-[#F7FBFC] p-8">
            <QrPlaceholder />

            <p className="mt-5 text-sm font-black text-[#0B2633]">
              Secure Membership QR
            </p>

            <p className="mt-2 text-center text-xs leading-5 text-black/45">
              This development QR is a visual
              placeholder. The production version
              will contain a secure server-generated
              reference.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              QR Usage
            </p>

            <h2 className="mt-2 text-xl font-black text-[#0B2633]">
              Secure verification
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/50">
              The final QR implementation will
              support authorized verification,
              attendance, participation and other
              permitted KUHRSA workflows without
              exposing raw member information.
            </p>

            <div className="mt-5 space-y-3">
              <InfoTile
                label="Member Reference"
                value={mock.overview.membershipNumber}
              />

              <InfoTile
                label="Development Status"
                value="Placeholder"
              />
            </div>
          </div>
        </section>
      )}

      {view === "history" && (
        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] text-left">
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Period
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Status
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Start
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    End
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Source
                  </th>
                </tr>
              </thead>

              <tbody>
                {mock.history.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b border-black/[0.04]"
                    >
                      <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                        {item.period}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                            item.status,
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {item.startDate}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {item.endDate}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {item.source}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {view === "activation" && (
        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Account Activation
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                {mock.activation.status}
              </h2>

              <p className="mt-2 text-sm text-black/45">
                Your member account has completed the
                activation workflow.
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-xs font-black ${statusClass(
                mock.activation.status,
              )}`}
            >
              Active
            </span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <InfoTile
              label="Activation Date"
              value={
                mock.activation.activationDate
              }
            />

            <InfoTile
              label="Account Status"
              value={
                mock.activation.accountStatus
              }
            />
          </div>
        </section>
      )}

      {view === "renewal" && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Renewal Status
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
              {mock.renewal.currentStatus}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/45">
              Your membership is currently within
              the active cycle. Renewal information will
              update when the next renewal window opens.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <InfoTile
                label="Current Period"
                value={
                  mock.renewal.currentPeriod
                }
              />

              <InfoTile
                label="Previous Renewal"
                value={
                  mock.renewal.previousRenewal
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#168DB8]/10 bg-[#168DB8]/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Renewal Window
            </p>

            <p className="mt-3 text-sm leading-6 font-bold text-[#0B2633]">
              {mock.renewal.renewalWindow}
            </p>
          </div>
        </section>
      )}

      {view === "verification" && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                  Verification Result
                </p>

                <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                  Membership verified
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                  mock.verification
                    .verificationStatus,
                )}`}
              >
                {
                  mock.verification
                    .verificationStatus
                }
              </span>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <InfoTile
                label="Last Verified"
                value={
                  mock.verification.lastVerified
                }
              />

              <InfoTile
                label="Verified By"
                value={
                  mock.verification.verifiedBy
                }
              />

              <InfoTile
                label="Reference"
                value={
                  mock.verification
                    .verificationReference
                }
              />

              <InfoTile
                label="Membership Number"
                value={
                  mock.overview.membershipNumber
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-[#F8FBFC] p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Verification
            </p>

            <p className="mt-3 text-sm leading-6 text-black/50">
              Production verification will be backed
              by the secure membership verification
              service and audited where required.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
