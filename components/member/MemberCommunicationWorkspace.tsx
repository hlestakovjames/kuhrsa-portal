"use client";

import Link from "next/link";

import { memberCommunicationMock } from "@/lib/mock/member-communication";

type CommunicationView =
  | "overview"
  | "notifications"
  | "messages"
  | "support"
  | "feedback"
  | "preferences";

type MemberCommunicationWorkspaceProps = {
  view: CommunicationView;
};

const mock = memberCommunicationMock;

function statusClass(status: string) {
  switch (status) {
    case "Open":
    case "Received":
    case "Active":
      return "bg-emerald-50 text-emerald-700";

    case "Reviewed":
    case "Resolved":
      return "bg-black/[0.04] text-black/50";

    default:
      return "bg-[#168DB8]/10 text-[#168DB8]";
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

export default function MemberCommunicationWorkspace({
  view,
}: MemberCommunicationWorkspaceProps) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {view === "overview" && (
        <>
          <Header
            title="Communication Overview"
            description="Manage KUHRSA notifications, messages, support requests, feedback and communication preferences."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoTile
              label="Unread Notifications"
              value={String(
                mock.overview.unreadNotifications,
              )}
            />

            <InfoTile
              label="Unread Messages"
              value={String(
                mock.overview.unreadMessages,
              )}
            />

            <InfoTile
              label="Open Requests"
              value={String(
                mock.overview.openRequests,
              )}
            />

            <InfoTile
              label="Preferred Channel"
              value={
                mock.overview.preferredChannel
              }
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Recent Notifications
              </p>

              <div className="mt-5 space-y-3">
                {mock.notifications
                  .slice(0, 3)
                  .map((notification) => (
                    <Link
                      href="/dashboard/communication/notifications"
                      key={notification.id}
                      className="block rounded-xl border border-black/[0.05] p-4 transition hover:bg-[#168DB8]/[0.03]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-[#0B2633]">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-black/45">
                            {notification.message}
                          </p>
                        </div>

                        {!notification.read && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#168DB8]" />
                        )}
                      </div>

                      <p className="mt-2 text-[10px] font-bold text-black/25">
                        {notification.date} ·{" "}
                        {notification.time}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
                Communication Services
              </p>

              <div className="mt-4 space-y-2">
                <ActionLink
                  href="/dashboard/communication/notifications"
                  label="Notifications"
                />

                <ActionLink
                  href="/dashboard/communication/messages"
                  label="Messages"
                />

                <ActionLink
                  href="/dashboard/communication/support"
                  label="Support"
                />

                <ActionLink
                  href="/dashboard/communication/feedback"
                  label="Feedback"
                />

                <ActionLink
                  href="/dashboard/communication/preferences"
                  label="Notification Preferences"
                />
              </div>
            </div>
          </section>
        </>
      )}

      {view === "notifications" && (
        <>
          <Header
            title="Notifications"
            description="Review notifications generated for your KUHRSA member account."
          />

          <section className="mt-6 space-y-3">
            {mock.notifications.map(
              (notification) => (
                <article
                  key={notification.id}
                  className={`rounded-2xl border bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)] ${
                    notification.read
                      ? "border-black/[0.06]"
                      : "border-[#168DB8]/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#168DB8]/10 text-[#168DB8]">
                      <span className="text-sm font-black">
                        !
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-black text-[#0B2633]">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-[#168DB8]">
                            {notification.type}
                          </p>
                        </div>

                        <p className="text-[10px] font-bold text-black/30">
                          {notification.date} ·{" "}
                          {notification.time}
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-black/50">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#168DB8]" />
                    )}
                  </div>
                </article>
              ),
            )}
          </section>
        </>
      )}

      {view === "messages" && (
        <>
          <Header
            title="Messages"
            description="View direct messages and official communication sent through the KUHRSA member portal."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <div className="divide-y divide-black/[0.05]">
              {mock.messages.map(
                (message) => (
                  <article
                    key={message.id}
                    className="p-5 transition hover:bg-[#F8FBFC]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2633] text-xs font-black text-white">
                        {message.sender
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm font-black text-[#0B2633]">
                            {message.sender}
                          </p>

                          <p className="text-[10px] font-bold text-black/30">
                            {message.date} ·{" "}
                            {message.time}
                          </p>
                        </div>

                        <p className="mt-2 text-sm font-bold text-[#0B2633]">
                          {message.subject}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-black/45">
                          {message.preview}
                        </p>
                      </div>

                      {!message.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#168DB8]" />
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>
        </>
      )}

      {view === "support" && (
        <>
          <Header
            title="Support"
            description="Submit and track support requests relating to your KUHRSA membership and services."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoTile
              label="Open Requests"
              value={String(
                mock.support.openRequests,
              )}
            />

            <InfoTile
              label="Resolved Requests"
              value={String(
                mock.support.resolvedRequests,
              )}
            />
          </section>

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <div className="divide-y divide-black/[0.05]">
              {mock.support.requests.map(
                (request) => (
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
                          {request.category} ·{" "}
                          Submitted{" "}
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
                  </article>
                ),
              )}
            </div>
          </section>

          <Link
            href="/dashboard/services/submit"
            className="mt-5 inline-flex rounded-xl bg-[#0B2633] px-5 py-3 text-xs font-black text-white transition hover:bg-[#123747]"
          >
            Submit New Request
          </Link>
        </>
      )}

      {view === "feedback" && (
        <>
          <Header
            title="Feedback"
            description="Share feedback about your KUHRSA member experience and review previous submissions."
          />

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoTile
              label="Submissions"
              value={String(
                mock.feedback.submitted,
              )}
            />

            <InfoTile
              label="Latest Status"
              value={
                mock.feedback.entries[0]
                  ?.status ?? "None"
              }
            />
          </section>

          <section className="mt-6 space-y-3">
            {mock.feedback.entries.map(
              (entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-[#0B2633]">
                        {entry.subject}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        Submitted {entry.date}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-black ${statusClass(
                        entry.status,
                      )}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </article>
              ),
            )}
          </section>

          <div className="mt-5 rounded-2xl border border-dashed border-black/10 bg-[#F8FBFC] p-5">
            <p className="text-sm font-black text-[#0B2633]">
              Feedback submission
            </p>

            <p className="mt-2 text-xs leading-5 text-black/45">
              The production feedback form will submit
              securely to the member communication service.
            </p>
          </div>
        </>
      )}

      {view === "preferences" && (
        <>
          <Header
            title="Notification Preferences"
            description="Control the types of KUHRSA communication you receive through available channels."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
            <div className="space-y-1">
              <PreferenceRow
                label="Portal Notifications"
                description="Show notifications inside your member portal."
                enabled={
                  mock.preferences.portal
                }
              />

              <PreferenceRow
                label="Email"
                description="Receive eligible KUHRSA communication by email."
                enabled={
                  mock.preferences.email
                }
              />

              <PreferenceRow
                label="SMS"
                description="Receive eligible KUHRSA communication by SMS."
                enabled={
                  mock.preferences.sms
                }
              />

              <PreferenceRow
                label="Event Reminders"
                description="Receive reminders for registered events."
                enabled={
                  mock.preferences.eventReminders
                }
              />

              <PreferenceRow
                label="Membership Reminders"
                description="Receive membership and renewal reminders."
                enabled={
                  mock.preferences.membershipReminders
                }
              />

              <PreferenceRow
                label="Finance Notifications"
                description="Receive relevant payment and finance notifications."
                enabled={
                  mock.preferences.financeNotifications
                }
              />

              <PreferenceRow
                label="Announcements"
                description="Receive important KUHRSA announcements."
                enabled={
                  mock.preferences.announcements
                }
              />

              <PreferenceRow
                label="Activity Notifications"
                description="Receive updates relating to registered activities."
                enabled={
                  mock.preferences.activityNotifications
                }
              />
            </div>

            <div className="mt-6 rounded-xl bg-[#F8FBFC] p-4">
              <p className="text-xs leading-5 text-black/45">
                These are frontend development preferences.
                Production preference changes will be persisted
                against the authenticated member account.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function PreferenceRow({
  label,
  description,
  enabled,
}: {
  label: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-black/[0.05] py-4 last:border-b-0">
      <div>
        <p className="text-sm font-bold text-[#0B2633]">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-black/40">
          {description}
        </p>
      </div>

      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full p-1 ${
          enabled
            ? "bg-[#168DB8]"
            : "bg-black/10"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </span>
    </div>
  );
}
