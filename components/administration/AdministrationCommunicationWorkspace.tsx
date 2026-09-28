"use client";

import Link from "next/link";

type CommunicationView =
  | "dashboard"
  | "notifications"
  | "messages"
  | "members"
  | "email"
  | "sms"
  | "templates"
  | "campaigns"
  | "history";

type Props = {
  view: CommunicationView;
};

const notifications = [
  {
    title: "AGM reminder",
    audience: "All Members",
    channel: "In-app",
    status: "Published",
  },
  {
    title: "Membership renewal reminder",
    audience: "Active Members",
    channel: "Email",
    status: "Scheduled",
  },
  {
    title: "Executive meeting notice",
    audience: "Executives",
    channel: "In-app",
    status: "Draft",
  },
];

const messages = [
  {
    subject: "Membership enquiry",
    sender: "Member Support",
    received: "08 Sep 2026",
    status: "Open",
  },
  {
    subject: "Event registration question",
    sender: "Member Services",
    received: "08 Sep 2026",
    status: "Resolved",
  },
  {
    subject: "Certificate verification enquiry",
    sender: "External Contact",
    received: "07 Sep 2026",
    status: "Pending",
  },
];

const memberCommunications = [
  {
    title: "September membership update",
    audience: "All Members",
    channel: "Email",
    recipients: "1,284",
    status: "Sent",
  },
  {
    title: "AGM & welcome announcement",
    audience: "Students",
    channel: "SMS",
    recipients: "926",
    status: "Scheduled",
  },
  {
    title: "Executive committee notice",
    audience: "Executives",
    channel: "In-app",
    recipients: "16",
    status: "Sent",
  },
];

const templates = [
  ["Member Welcome", "Email", "Active"],
  ["Membership Renewal Reminder", "SMS", "Active"],
  ["Event Registration Confirmation", "Email", "Active"],
  ["Password Reset", "Email", "Active"],
  ["Executive Appointment Notice", "Email", "Draft"],
];

const campaigns = [
  {
    title: "2026/27 Membership Campaign",
    channel: "Email + SMS",
    audience: "Prospective Members",
    status: "Active",
  },
  {
    title: "AGM Attendance Campaign",
    channel: "SMS + In-app",
    audience: "All Members",
    status: "Scheduled",
  },
  {
    title: "Professional Development Promotion",
    channel: "Email",
    audience: "Students",
    status: "Draft",
  },
];

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#CE26A4]">
        Communication
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_6px_20px_rgba(11,38,51,0.03)]">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  const positive =
    value === "Active" ||
    value === "Sent" ||
    value === "Resolved" ||
    value === "Published";

  const attention =
    value === "Scheduled" ||
    value === "Draft" ||
    value === "Open" ||
    value === "Pending";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : attention
            ? "bg-[#CE26A4]/10 text-[#CE26A4]"
            : "bg-black/[0.05] text-black/50"
      }`}
    >
      {value}
    </span>
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <Header
        title="Communication Dashboard"
        description="Administrative oversight of KUHRSA notifications, messages, member communications, email, SMS, templates and campaigns."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Notifications Sent" value="1,684" />
        <StatCard label="Messages Open" value="12" />
        <StatCard label="Email Delivery" value="96.8%" />
        <StatCard label="SMS Delivery" value="94.2%" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#0B2633]">
                Recent Notifications
              </h2>

              <p className="mt-1 text-sm text-black/40">
                Synthetic communication records.
              </p>
            </div>

            <Link
              href="/administration/notifications"
              className="text-sm font-black text-[#CE26A4]"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {notifications.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-[#F8FBFC] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0B2633]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {item.audience} • {item.channel}
                    </p>
                  </div>

                  <Badge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Communication Operations
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Messages", "/administration/communication/messages"],
              ["Member Communications", "/administration/communication/members"],
              ["Email", "/administration/communication/email"],
              ["SMS", "/administration/communication/sms"],
              ["Templates", "/administration/communication/templates"],
              ["Campaigns", "/administration/communication/campaigns"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl bg-[#F8FBFC] p-4 text-sm font-bold text-[#0B2633] transition hover:bg-[#FFF7FC]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Active Campaigns
        </h2>

        <div className="mt-5 space-y-3">
          {campaigns.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-black/[0.05] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[#0B2633]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {item.channel} • {item.audience}
                  </p>
                </div>

                <Badge value={item.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function NotificationsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Notifications"
        description="Manage administrative notifications and in-portal communication."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent" value="1,684" />
        <StatCard label="Scheduled" value="18" />
        <StatCard label="Drafts" value="7" />
      </section>

      <section className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Audience: {item.audience} • Channel: {item.channel}
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function MessagesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Messages"
        description="Review and manage communication messages received by the association."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Open" value="12" />
        <StatCard label="Pending" value="7" />
        <StatCard label="Resolved" value="86" />
      </section>

      <section className="space-y-3">
        {messages.map((item) => (
          <div
            key={item.subject}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.subject}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  From {item.sender} • {item.received}
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function MembersView() {
  return (
    <div className="space-y-6">
      <Header
        title="Member Communications"
        description="Coordinate official communication campaigns and messages to KUHRSA members."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Campaigns" value="18" />
        <StatCard label="Recipients Reached" value="2,426" />
        <StatCard label="Delivery Rate" value="95.7%" />
      </section>

      <section className="space-y-3">
        {memberCommunications.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.audience} • {item.channel} • {item.recipients} recipients
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function EmailView() {
  return (
    <div className="space-y-6">
      <Header
        title="Email"
        description="Manage KUHRSA email communication and delivery activity."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent Today" value="342" />
        <StatCard label="Delivered" value="331" />
        <StatCard label="Delivery Rate" value="96.8%" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Recent Email Activity
        </h2>

        <div className="mt-5 space-y-3">
          {[
            ["Membership update", "1,284 recipients", "Sent"],
            ["AGM reminder", "926 recipients", "Scheduled"],
            ["Executive notice", "16 recipients", "Sent"],
          ].map(([title, recipients, status]) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl bg-[#F8FBFC] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {recipients}
                </p>
              </div>

              <Badge value={status} />
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
          Development Mode
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          No campaign email is sent from this mock workspace. Provider
          integration and delivery tracking will use the backend later.
        </p>
      </div>
    </div>
  );
}

function SmsView() {
  return (
    <div className="space-y-6">
      <Header
        title="SMS"
        description="Manage KUHRSA SMS communications and delivery activity."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent Today" value="714" />
        <StatCard label="Delivered" value="673" />
        <StatCard label="Delivery Rate" value="94.2%" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Recent SMS Activity
        </h2>

        <div className="mt-5 space-y-3">
          {[
            ["AGM reminder", "926 recipients", "Scheduled"],
            ["Renewal reminder", "318 recipients", "Sent"],
            ["Event registration confirmation", "84 recipients", "Sent"],
          ].map(([title, recipients, status]) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl bg-[#F8FBFC] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {recipients}
                </p>
              </div>

              <Badge value={status} />
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-700">
          Development Mode
        </p>

        <p className="mt-2 text-sm leading-6 text-amber-800">
          No live SMS is dispatched from this frontend. SMS provider and
          delivery integration will be connected through the backend later.
        </p>
      </div>
    </div>
  );
}

function TemplatesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Templates"
        description="Manage reusable communication templates."
      />

      <section className="space-y-3">
        {templates.map(([name, channel, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {channel} template
                </p>
              </div>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function CampaignsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Campaigns"
        description="Plan and monitor coordinated communication campaigns."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Campaigns" value="4" />
        <StatCard label="Scheduled" value="7" />
        <StatCard label="Completed" value="18" />
      </section>

      <section className="space-y-3">
        {campaigns.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.channel} • {item.audience}
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function HistoryView() {
  return (
    <div className="space-y-6">
      <Header
        title="Communication History"
        description="Historical record of KUHRSA administrative communications."
      />

      <section className="space-y-3">
        {[
          ["Membership update", "Email", "1,284 recipients", "08 Sep 2026"],
          ["AGM reminder", "SMS", "926 recipients", "08 Sep 2026"],
          ["Executive notice", "In-app", "16 recipients", "07 Sep 2026"],
          ["Event confirmation", "Email", "84 recipients", "07 Sep 2026"],
          ["Renewal reminder", "SMS", "318 recipients", "06 Sep 2026"],
        ].map(([title, channel, recipients, date]) => (
          <div
            key={`${title}-${date}`}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {channel} • {recipients} • {date}
                </p>
              </div>

              <span className="text-xs font-black text-emerald-700">
                Delivered
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AdministrationCommunicationWorkspace({
  view,
}: Props) {
  switch (view) {
    case "notifications":
      return <NotificationsView />;

    case "messages":
      return <MessagesView />;

    case "members":
      return <MembersView />;

    case "email":
      return <EmailView />;

    case "sms":
      return <SmsView />;

    case "templates":
      return <TemplatesView />;

    case "campaigns":
      return <CampaignsView />;

    case "history":
      return <HistoryView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
