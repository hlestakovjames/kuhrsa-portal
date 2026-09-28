"use client";

import Link from "next/link";

import { memberEventsActivitiesMock } from "@/lib/mock/member-events-activities";

type EventsActivitiesView =
  | "overview"
  | "events"
  | "activities"
  | "upcoming-events"
  | "upcoming-activities"
  | "event-registration"
  | "activity-registration"
  | "registrations"
  | "attendance"
  | "history"
  | "certificates";

type MemberEventsActivitiesWorkspaceProps = {
  view: EventsActivitiesView;
};

const mock = memberEventsActivitiesMock;

function statusClass(status: string) {
  switch (status) {
    case "Upcoming":
    case "Registered":
    case "Confirmed":
    case "Present":
    case "Issued":
      return "bg-emerald-50 text-emerald-700";

    case "Open":
      return "bg-[#168DB8]/10 text-[#168DB8]";

    case "Past":
    case "Completed":
      return "bg-black/[0.04] text-black/50";

    case "Absent":
      return "bg-red-50 text-red-700";

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

function ViewHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ring-1 ring-black/[0.06] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.17em] text-[#168DB8]">
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

function EventCard({
  item,
}: {
  item: (typeof mock.events)[number];
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
            Event
          </p>

          <h2 className="mt-2 text-lg font-black text-[#0B2633]">
            {item.title}
          </h2>

          <p className="mt-1 text-xs font-semibold text-black/35">
            {item.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
              item.status,
            )}`}
          >
            {item.status}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
              item.registrationStatus,
            )}`}
          >
            {item.registrationStatus}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <InfoTile
          label="Date"
          value={item.date}
        />

        <InfoTile
          label="Time"
          value={item.time}
        />

        <InfoTile
          label="Venue"
          value={item.venue}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-black/45">
        {item.description}
      </p>
    </div>
  );
}

function ActivityCard({
  item,
}: {
  item: (typeof mock.activities)[number];
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
            Activity
          </p>

          <h2 className="mt-2 text-lg font-black text-[#0B2633]">
            {item.title}
          </h2>

          <p className="mt-1 text-xs font-semibold text-black/35">
            {item.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
              item.status,
            )}`}
          >
            {item.status}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
              item.registrationStatus,
            )}`}
          >
            {item.registrationStatus}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <InfoTile
          label="Date"
          value={item.date}
        />

        <InfoTile
          label="Time"
          value={item.time}
        />

        <InfoTile
          label="Venue"
          value={item.venue}
        />
      </div>

      <p className="mt-4 text-sm leading-6 text-black/45">
        {item.description}
      </p>
    </div>
  );
}

export default function MemberEventsActivitiesWorkspace({
  view,
}: MemberEventsActivitiesWorkspaceProps) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {view === "overview" && (
        <>
          <ViewHeader
            title="Events & Activities Overview"
            description="Discover upcoming KUHRSA events and activities, manage registrations and review your participation."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              label="Upcoming Events"
              value={String(
                mock.events.filter(
                  (event) =>
                    event.status ===
                    "Upcoming",
                ).length,
              )}
            />

            <InfoTile
              label="Upcoming Activities"
              value={String(
                mock.activities.filter(
                  (activity) =>
                    activity.status ===
                    "Upcoming",
                ).length,
              )}
            />

            <InfoTile
              label="My Registrations"
              value={String(
                mock.registrations.length,
              )}
            />

            <InfoTile
              label="Attendance Records"
              value={String(
                mock.attendance.length,
              )}
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Events
              </p>

              <h2 className="mt-1 text-xl font-black text-[#0B2633]">
                Upcoming Events
              </h2>

              <div className="mt-5 space-y-3">
                {mock.events
                  .filter(
                    (event) =>
                      event.status ===
                      "Upcoming",
                  )
                  .slice(0, 2)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-black/[0.05] p-4"
                    >
                      <p className="text-sm font-black text-[#0B2633]">
                        {event.title}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {event.date} ·{" "}
                        {event.time}
                      </p>

                      <p className="mt-1 text-xs text-black/35">
                        {event.venue}
                      </p>
                    </div>
                  ))}
              </div>

              <Link
                href="/dashboard/events/upcoming"
                className="mt-5 inline-flex text-xs font-black text-[#168DB8]"
              >
                View upcoming events →
              </Link>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Activities
              </p>

              <h2 className="mt-1 text-xl font-black text-[#0B2633]">
                Upcoming Activities
              </h2>

              <div className="mt-5 space-y-3">
                {mock.activities
                  .filter(
                    (activity) =>
                      activity.status ===
                      "Upcoming",
                  )
                  .slice(0, 2)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-xl border border-black/[0.05] p-4"
                    >
                      <p className="text-sm font-black text-[#0B2633]">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {activity.date} ·{" "}
                        {activity.time}
                      </p>

                      <p className="mt-1 text-xs text-black/35">
                        {activity.venue}
                      </p>
                    </div>
                  ))}
              </div>

              <Link
                href="/dashboard/activities/upcoming"
                className="mt-5 inline-flex text-xs font-black text-[#168DB8]"
              >
                View upcoming activities →
              </Link>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Participation
            </p>

            <h2 className="mt-1 text-xl font-black text-[#0B2633]">
              Member Activity Centre
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ActionLink
                href="/dashboard/events/all"
                label="Browse Events"
              />

              <ActionLink
                href="/dashboard/activities"
                label="Browse Activities"
              />

              <ActionLink
                href="/dashboard/events/registrations"
                label="My Registrations"
              />

              <ActionLink
                href="/dashboard/events/attendance"
                label="Attendance"
              />
            </div>
          </section>
        </>
      )}

      {(view === "events" ||
        view === "upcoming-events") && (
        <>
          <ViewHeader
            title={
              view === "events"
                ? "Events"
                : "Upcoming Events"
            }
            description="Explore KUHRSA events and view their dates, venues, categories and registration status."
          />

          <section className="mt-6 space-y-4">
            {mock.events
              .filter((event) =>
                view === "upcoming-events"
                  ? event.status ===
                    "Upcoming"
                  : true,
              )
              .map((event) => (
                <EventCard
                  key={event.id}
                  item={event}
                />
              ))}
          </section>
        </>
      )}

      {(view === "activities" ||
        view === "upcoming-activities") && (
        <>
          <ViewHeader
            title={
              view === "activities"
                ? "Activities"
                : "Upcoming Activities"
            }
            description="Explore KUHRSA activities and manage your participation."
          />

          <section className="mt-6 space-y-4">
            {mock.activities
              .filter((activity) =>
                view ===
                "upcoming-activities"
                  ? activity.status ===
                    "Upcoming"
                  : true,
              )
              .map((activity) => (
                <ActivityCard
                  key={activity.id}
                  item={activity}
                />
              ))}
          </section>
        </>
      )}

      {view === "event-registration" && (
        <>
          <ViewHeader
            title="Event Registration"
            description="Review events available for registration and your current event registration state."
          />

          <section className="mt-6 space-y-4">
            {mock.events
              .filter(
                (event) =>
                  event.status ===
                  "Upcoming",
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-[#0B2633]">
                        {event.title}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {event.date} ·{" "}
                        {event.venue}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                        event.registrationStatus,
                      )}`}
                    >
                      {event.registrationStatus}
                    </span>
                  </div>
                </div>
              ))}
          </section>
        </>
      )}

      {view === "activity-registration" && (
        <>
          <ViewHeader
            title="Activity Registration"
            description="Review activities available for registration and your current activity registration state."
          />

          <section className="mt-6 space-y-4">
            {mock.activities
              .filter(
                (activity) =>
                  activity.status ===
                  "Upcoming",
              )
              .map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-[#0B2633]">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {activity.date} ·{" "}
                        {activity.venue}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                        activity.registrationStatus,
                      )}`}
                    >
                      {activity.registrationStatus}
                    </span>
                  </div>
                </div>
              ))}
          </section>
        </>
      )}

      {view === "registrations" && (
        <>
          <ViewHeader
            title="My Registrations"
            description="Review events and activities you have registered for."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-left">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Type
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Item
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Date
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Registered
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {mock.registrations.map(
                    (registration) => (
                      <tr
                        key={registration.id}
                        className="border-b border-black/[0.04]"
                      >
                        <td className="px-4 py-4 text-sm text-black/50">
                          {registration.type}
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                          {registration.title}
                        </td>

                        <td className="px-4 py-4 text-sm text-black/50">
                          {registration.date}
                        </td>

                        <td className="px-4 py-4 text-sm text-black/50">
                          {registration.registrationDate}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                              registration.status,
                            )}`}
                          >
                            {registration.status}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {view === "attendance" && (
        <>
          <ViewHeader
            title="Attendance"
            description="Review attendance records for your KUHRSA events and activities."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoTile
              label="Attendance Records"
              value={String(
                mock.attendance.length,
              )}
            />

            <InfoTile
              label="Present"
              value={String(
                mock.attendance.filter(
                  (record) =>
                    record.attendanceStatus ===
                    "Present",
                ).length,
              )}
            />

            <InfoTile
              label="Absent"
              value={String(
                mock.attendance.filter(
                  (record) =>
                    record.attendanceStatus ===
                    "Absent",
                ).length,
              )}
            />
          </section>

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] text-left">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Type
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Event / Activity
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Date
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                      Attendance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {mock.attendance.map(
                    (record) => (
                      <tr
                        key={record.id}
                        className="border-b border-black/[0.04]"
                      >
                        <td className="px-4 py-4 text-sm text-black/50">
                          {record.type}
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                          {record.title}
                        </td>

                        <td className="px-4 py-4 text-sm text-black/50">
                          {record.date}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(
                              record.attendanceStatus,
                            )}`}
                          >
                            {
                              record.attendanceStatus
                            }
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {view === "history" && (
        <>
          <ViewHeader
            title="Event History"
            description="Review your previous participation in KUHRSA events and activities."
          />

          <section className="mt-6 space-y-3">
            {mock.history.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
                      {item.type}
                    </p>

                    <p className="mt-1 text-sm font-black text-[#0B2633]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {item.date}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                      item.participation,
                    )}`}
                  >
                    {item.participation}
                  </span>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {view === "certificates" && (
        <>
          <ViewHeader
            title="Certificates"
            description="View certificates issued for eligible KUHRSA events and activities."
          />

          <section className="mt-6 space-y-3">
            {mock.certificates.map(
              (certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#168DB8]">
                        {
                          certificate.certificateNumber
                        }
                      </p>

                      <h2 className="mt-2 text-lg font-black text-[#0B2633]">
                        {certificate.title}
                      </h2>

                      <p className="mt-1 text-xs text-black/40">
                        Issued{" "}
                        {certificate.issueDate}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClass(
                        certificate.status,
                      )}`}
                    >
                      {certificate.status}
                    </span>
                  </div>
                </div>
              ),
            )}
          </section>
        </>
      )}
    </div>
  );
}
