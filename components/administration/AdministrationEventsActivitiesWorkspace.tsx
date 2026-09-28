"use client";

import Link from "next/link";

type EventsActivitiesView =
  | "dashboard"
  | "events"
  | "activities"
  | "event-registration"
  | "activity-registration"
  | "attendance"
  | "qr-check-in"
  | "venues"
  | "participants"
  | "logistics"
  | "tasks"
  | "documents"
  | "reports";

type Props = {
  view: EventsActivitiesView;
};

type EventRecord = {
  title: string;
  date: string;
  venue: string;
  registrations: number;
  status: string;
};

type ActivityRecord = {
  title: string;
  date: string;
  participants: number;
  status: string;
};

const events: EventRecord[] = [
  {
    title: "AGM & First-Year Welcome",
    date: "17 Sep 2026",
    venue: "New Amphitheater",
    registrations: 214,
    status: "Upcoming",
  },
  {
    title: "Professional Development Session",
    date: "24 Sep 2026",
    venue: "Main Lecture Hall",
    registrations: 86,
    status: "Registration Open",
  },
  {
    title: "Leadership Forum",
    date: "03 Oct 2026",
    venue: "University Conference Centre",
    registrations: 112,
    status: "Planned",
  },
];

const activities: ActivityRecord[] = [
  {
    title: "Student Mentorship",
    date: "19 Sep 2026",
    participants: 54,
    status: "Upcoming",
  },
  {
    title: "Career & Professional Engagement",
    date: "27 Sep 2026",
    participants: 72,
    status: "Registration Open",
  },
  {
    title: "Academic Support Initiative",
    date: "05 Oct 2026",
    participants: 41,
    status: "Planned",
  },
];

const venues = [
  {
    name: "New Amphitheater",
    capacity: 500,
    location: "Main Campus",
    status: "Available",
  },
  {
    name: "Main Lecture Hall",
    capacity: 250,
    location: "Academic Block",
    status: "Available",
  },
  {
    name: "Student Centre",
    capacity: 180,
    location: "Student Centre",
    status: "Reserved",
  },
];

const participants = [
  {
    name: "Alex Morgan",
    member: "KUHRSA-STD-0042",
    event: "AGM & First-Year Welcome",
    status: "Registered",
  },
  {
    name: "Brian Otieno",
    member: "KUHRSA-STD-0077",
    event: "Professional Development Session",
    status: "Registered",
  },
  {
    name: "Cynthia Wambui",
    member: "KUHRSA-ALU-0018",
    event: "Leadership Forum",
    status: "Confirmed",
  },
  {
    name: "Daniel Kariuki",
    member: "KUHRSA-LCT-0009",
    event: "AGM & First-Year Welcome",
    status: "Attended",
  },
];

const tasks = [
  {
    title: "Confirm amphitheater setup",
    owner: "Events Team",
    due: "14 Sep 2026",
    status: "In Progress",
  },
  {
    title: "Prepare registration desk",
    owner: "Organizing Office",
    due: "16 Sep 2026",
    status: "Pending",
  },
  {
    title: "Test QR check-in",
    owner: "ICT Manager",
    due: "16 Sep 2026",
    status: "Pending",
  },
  {
    title: "Publish event notice",
    owner: "Publicity Secretary",
    due: "12 Sep 2026",
    status: "Completed",
  },
];

const logistics = [
  ["Venue", "New Amphitheater"],
  ["Expected Attendance", "300"],
  ["Registration Status", "Open"],
  ["Check-in Method", "QR + Manual"],
  ["Documents", "4"],
  ["Assigned Team", "Events & Organizing"],
];

const documents = [
  "Event concept note",
  "Event programme",
  "Venue booking confirmation",
  "Attendance register",
  "Event report",
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
        Events & Activities
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
    value === "Upcoming" ||
    value === "Available" ||
    value === "Registered" ||
    value === "Confirmed" ||
    value === "Attended" ||
    value === "Completed";

  const active =
    value === "Registration Open" ||
    value === "Planned" ||
    value === "Pending" ||
    value === "In Progress" ||
    value === "Reserved";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : active
            ? "bg-[#CE26A4]/10 text-[#CE26A4]"
            : "bg-black/[0.05] text-black/50"
      }`}
    >
      {value}
    </span>
  );
}

function EventsTable() {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2633]">
            Upcoming Events
          </h2>

          <p className="mt-1 text-sm text-black/40">
            Synthetic event records for frontend development.
          </p>
        </div>

        <Link
          href="/administration/events/all"
          className="text-sm font-black text-[#CE26A4]"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-black/[0.06]">
              {[
                "Event",
                "Date",
                "Venue",
                "Registrations",
                "Status",
              ].map((item) => (
                <th
                  key={item}
                  className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {events.map((item) => (
              <tr
                key={item.title}
                className="border-b border-black/[0.05] last:border-0"
              >
                <td className="px-3 py-4 text-sm font-black text-[#0B2633] first:pl-0">
                  {item.title}
                </td>

                <td className="px-3 py-4 text-xs text-black/55">
                  {item.date}
                </td>

                <td className="px-3 py-4 text-xs text-black/55">
                  {item.venue}
                </td>

                <td className="px-3 py-4 text-xs font-black text-[#0B2633]">
                  {item.registrations}
                </td>

                <td className="px-3 py-4">
                  <Badge value={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActivitiesTable() {
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
      <div className="mb-5">
        <h2 className="text-lg font-black text-[#0B2633]">
          Upcoming Activities
        </h2>

        <p className="mt-1 text-sm text-black/40">
          Activities remain separate from event records.
        </p>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-[#F8FBFC] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.date} • {item.participants} participants
                </p>
              </div>

              <Badge value={item.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <Header
        title="Events Dashboard"
        description="Administrative oversight of KUHRSA events, activities, registration, attendance, venues, logistics and participation."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming Events" value="12" />
        <StatCard label="Upcoming Activities" value="8" />
        <StatCard label="Registrations" value="312" />
        <StatCard label="Attendance Rate" value="84%" />
      </section>

      <EventsTable />

      <div className="grid gap-6 xl:grid-cols-2">
        <ActivitiesTable />

        <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Event Operations
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Registration", "/administration/events/registration"],
              ["Attendance", "/administration/events/attendance"],
              ["QR Check-in", "/administration/events/qr-check-in"],
              ["Venues", "/administration/events/venues"],
              ["Participants", "/administration/events/participants"],
              ["Logistics", "/administration/events/logistics"],
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
        </section>
      </div>
    </div>
  );
}

function EventsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Events"
        description="Manage KUHRSA event records and their lifecycle."
      />

      <EventsTable />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Event Status Overview
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Upcoming", "12"],
            ["Registration Open", "7"],
            ["Completed", "28"],
          ].map(([label, value]) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivitiesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Activities"
        description="Manage KUHRSA activities separately from event records."
      />

      <ActivitiesTable />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value="8" />
        <StatCard label="Participants" value="167" />
        <StatCard label="Completed" value="31" />
      </section>
    </div>
  );
}

function EventRegistrationView() {
  return (
    <div className="space-y-6">
      <Header
        title="Event Registration"
        description="Manage registration and participation for KUHRSA events."
      />

      <section className="space-y-3">
        {events.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.date} • {item.registrations} registrations
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ActivityRegistrationView() {
  return (
    <div className="space-y-6">
      <Header
        title="Activity Registration"
        description="Manage registration for KUHRSA activities."
      />

      <section className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.date} • {item.participants} participants
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl bg-[#0B2633] px-4 py-2 text-xs font-black text-white"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function AttendanceView() {
  return (
    <div className="space-y-6">
      <Header
        title="Attendance"
        description="Monitor attendance records for KUHRSA events."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered" value="312" />
        <StatCard label="Present" value="262" />
        <StatCard label="Absent" value="50" />
        <StatCard label="Attendance Rate" value="84%" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.title}
              className="rounded-2xl bg-[#F8FBFC] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#0B2633]">
                    {event.title}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {event.registrations} registered • 84% synthetic attendance
                  </p>
                </div>

                <Link
                  href="/administration/events/qr-check-in"
                  className="text-sm font-black text-[#CE26A4]"
                >
                  Check-in →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function QRCheckInView() {
  return (
    <div className="space-y-6">
      <Header
        title="QR Check-in"
        description="Administrative QR-based event attendance workspace."
      />

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-[#0B2633] p-8 text-white">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-white/40">
            Scanner
          </p>

          <div className="mt-6 flex aspect-square max-w-[280px] items-center justify-center rounded-3xl border border-white/20 bg-white/5">
            <div className="flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-[#168DB8]">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-white/50">
                QR Scanner
              </span>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-white/55">
            Development placeholder. Camera access and secure QR verification
            will be connected during the integration phase.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <h2 className="text-lg font-black text-[#0B2633]">
            Active Check-in Session
          </h2>

          <div className="mt-5 space-y-3">
            {[
              ["Event", "AGM & First-Year Welcome"],
              ["Venue", "New Amphitheater"],
              ["Expected", "300"],
              ["Checked In", "142"],
              ["Manual Entries", "7"],
              ["Duplicate Scans", "0"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl bg-[#F8FBFC] px-4 py-3"
              >
                <span className="text-sm font-semibold text-black/55">
                  {label}
                </span>

                <span className="text-sm font-black text-[#0B2633]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function VenuesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Venues"
        description="Manage event venues, capacity and reservation status."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {venues.map((venue) => (
          <div
            key={venue.name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-black text-[#0B2633]">
                {venue.name}
              </h2>

              <Badge value={venue.status} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Capacity"
                value={String(venue.capacity)}
              />

              <StatCard
                label="Location"
                value={venue.location}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ParticipantsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Participants"
        description="View and manage registered event participants."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {[
                  "Participant",
                  "Member Number",
                  "Event",
                  "Status",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35 first:pl-0"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {participants.map((item) => (
                <tr
                  key={`${item.member}-${item.event}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-black text-[#0B2633] first:pl-0">
                    {item.name}
                  </td>

                  <td className="px-3 py-4 text-xs text-black/55">
                    {item.member}
                  </td>

                  <td className="px-3 py-4 text-xs text-black/55">
                    {item.event}
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LogisticsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Event Logistics"
        description="Coordinate operational requirements for KUHRSA events."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {logistics.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
              {label}
            </p>

            <p className="mt-2 text-sm font-black text-[#0B2633]">
              {value}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function TasksView() {
  return (
    <div className="space-y-6">
      <Header
        title="Event Tasks"
        description="Track operational tasks assigned to event teams and officers."
      />

      <section className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {task.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {task.owner} • Due {task.due}
                </p>
              </div>

              <Badge value={task.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Event Documents"
        description="Manage documents associated with events and activities."
      />

      <section className="grid gap-3 sm:grid-cols-2">
        {documents.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {item}
            </p>

            <p className="mt-2 text-xs text-black/40">
              Document record • Development placeholder
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Event Reports"
        description="Administrative reporting across events, activities and participation."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Events Held" value="28" />
        <StatCard label="Activities Held" value="31" />
        <StatCard label="Participants" value="1,842" />
        <StatCard label="Attendance Rate" value="84%" />
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Available Reports
        </h2>

        <div className="mt-5 space-y-3">
          {[
            "Event registration report",
            "Activity participation report",
            "Attendance report",
            "QR check-in report",
            "Venue utilization report",
            "Event logistics report",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-[#F8FBFC] p-4 text-sm font-bold text-[#0B2633]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function AdministrationEventsActivitiesWorkspace({
  view,
}: Props) {
  switch (view) {
    case "events":
      return <EventsView />;

    case "activities":
      return <ActivitiesView />;

    case "event-registration":
      return <EventRegistrationView />;

    case "activity-registration":
      return <ActivityRegistrationView />;

    case "attendance":
      return <AttendanceView />;

    case "qr-check-in":
      return <QRCheckInView />;

    case "venues":
      return <VenuesView />;

    case "participants":
      return <ParticipantsView />;

    case "logistics":
      return <LogisticsView />;

    case "tasks":
      return <TasksView />;

    case "documents":
      return <DocumentsView />;

    case "reports":
      return <ReportsView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
