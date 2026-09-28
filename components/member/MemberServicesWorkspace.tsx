"use client";

import Link from "next/link";

import { memberServicesMock } from "@/lib/mock/member-services";

type ServicesView =
  | "overview"
  | "submit"
  | "requests"
  | "status"
  | "help";

type MemberServicesWorkspaceProps = {
  view: ServicesView;
};

const mock = memberServicesMock;

function statusClass(status: string) {
  switch (status) {
    case "Open":
    case "Received":
      return "bg-emerald-50 text-emerald-700";

    case "In Progress":
      return "bg-[#168DB8]/10 text-[#168DB8]";

    case "Resolved":
    case "Closed":
      return "bg-black/[0.04] text-black/50";

    default:
      return "bg-black/[0.04] text-black/55";
  }
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

function ActionLink({
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
        Member Services
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

export default function MemberServicesWorkspace({
  view,
}: MemberServicesWorkspaceProps) {
  if (view === "overview") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Services Overview"
          description="Access KUHRSA member services, submit requests and track support issues."
        />

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoTile
            label="Available Services"
            value={String(
              mock.overview.availableServices,
            )}
          />

          <InfoTile
            label="Open Requests"
            value={String(
              mock.overview.openRequests,
            )}
          />

          <InfoTile
            label="Resolved Requests"
            value={String(
              mock.overview.resolvedRequests,
            )}
          />

          <InfoTile
            label="Typical Response"
            value={mock.overview.averageResponse}
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Available Services
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {mock.services.map(
                (service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-black/[0.05] p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#168DB8]">
                      {service.category}
                    </p>

                    <h2 className="mt-2 text-sm font-black text-[#0B2633]">
                      {service.title}
                    </h2>

                    <p className="mt-2 text-xs leading-5 text-black/45">
                      {service.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Service Centre
            </p>

            <div className="mt-4 space-y-2">
              <ActionLink
                href="/dashboard/services/submit"
                label="Submit Request"
              />

              <ActionLink
                href="/dashboard/services/requests"
                label="My Requests"
              />

              <ActionLink
                href="/dashboard/services/status"
                label="Request Status"
              />

              <ActionLink
                href="/dashboard/services/help"
                label="Help & Support"
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (view === "submit") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Submit Request"
          description="Submit a service or support request to KUHRSA administration."
        />

        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.13em] text-black/40">
                Service Category
              </label>

              <div className="mt-2 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm font-bold text-[#0B2633]">
                Select a service
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.13em] text-black/40">
                Priority
              </label>

              <div className="mt-2 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm font-bold text-[#0B2633]">
                Normal
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-black uppercase tracking-[0.13em] text-black/40">
              Subject
            </label>

            <div className="mt-2 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm text-black/40">
              Enter request subject
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-black uppercase tracking-[0.13em] text-black/40">
              Description
            </label>

            <div className="mt-2 min-h-36 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 py-3 text-sm text-black/40">
              Describe the assistance you need...
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-black/10 bg-[#F8FBFC] p-5">
            <p className="text-sm font-black text-[#0B2633]">
              Development form
            </p>

            <p className="mt-2 text-xs leading-5 text-black/45">
              This is the frontend service-request
              interface. The production implementation
              will submit the request through the member
              services API.
            </p>
          </div>

          <button
            type="button"
            className="mt-6 rounded-xl bg-[#0B2633] px-5 py-3 text-xs font-black text-white"
          >
            Submit Request
          </button>
        </section>
      </div>
    );
  }

  if (view === "requests") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="My Requests"
          description="Review service and support requests submitted through your KUHRSA account."
        />

        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
          <div className="divide-y divide-black/[0.05]">
            {mock.requests.map((request) => (
              <article
                key={request.id}
                className="p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
                      {request.reference}
                    </p>

                    <h2 className="mt-2 text-sm font-black text-[#0B2633]">
                      {request.subject}
                    </h2>

                    <p className="mt-1 text-xs text-black/40">
                      {request.category} · Submitted{" "}
                      {request.submitted}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-black ${statusClass(
                      request.status,
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-black/45">
                  {request.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (view === "status") {
    const request = mock.requests[0];

    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Request Status"
          description="Track the current progress of your latest member service request."
        />

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.13em] text-[#168DB8]">
                  {request.reference}
                </p>

                <h2 className="mt-2 text-xl font-black text-[#0B2633]">
                  {request.subject}
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-black ${statusClass(
                  request.status,
                )}`}
              >
                {request.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <InfoTile
                label="Category"
                value={request.category}
              />

              <InfoTile
                label="Priority"
                value={request.priority}
              />

              <InfoTile
                label="Last Updated"
                value={request.updated}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[#F8FBFC] p-5">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-black/35">
                Latest Response
              </p>

              <p className="mt-2 text-sm leading-6 text-black/50">
                {request.response}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#168DB8]/10 bg-[#168DB8]/5 p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Request Timeline
            </p>

            <div className="mt-5 space-y-5">
              <TimelineItem
                title="Request submitted"
                value={request.submitted}
                active
              />

              <TimelineItem
                title="Request received"
                value={request.submitted}
                active
              />

              <TimelineItem
                title="Current status"
                value={request.status}
                active
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Header
        title="Help & Support"
        description="Find the appropriate KUHRSA member service for the assistance you need."
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {mock.help.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Member Support
            </p>

            <h2 className="mt-2 text-lg font-black text-[#0B2633]">
              {item.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/45">
              {item.description}
            </p>

            <span className="mt-5 inline-flex text-xs font-black text-[#168DB8]">
              Open service →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

function TimelineItem({
  title,
  value,
  active,
}: {
  title: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
          active
            ? "bg-[#168DB8]"
            : "bg-black/10"
        }`}
      />

      <div>
        <p className="text-sm font-black text-[#0B2633]">
          {title}
        </p>

        <p className="mt-1 text-xs text-black/40">
          {value}
        </p>
      </div>
    </div>
  );
}
