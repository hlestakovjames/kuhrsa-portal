"use client";

import { memberAccountMock } from "@/lib/mock/member-account";

type AccountView =
  | "profile"
  | "security"
  | "login-history"
  | "settings";

type MemberAccountWorkspaceProps = {
  view: AccountView;
};

const mock = memberAccountMock;

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

export default function MemberAccountWorkspace({
  view,
}: MemberAccountWorkspaceProps) {
  if (view === "profile") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Profile"
          description="Review the account information associated with your KUHRSA member portal."
        />

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

            <InfoTile
              label="Registration Number"
              value={
                mock.profile
                  .registrationNumber
              }
            />
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#F8FBFC] p-5">
            <p className="text-sm font-black text-[#0B2633]">
              Profile editing
            </p>

            <p className="mt-2 text-xs leading-5 text-black/45">
              The production version will allow
              members to update permitted profile
              information through the authenticated
              member account service.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (view === "security") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Security"
          description="Review your account security status and security controls."
        />

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile
            label="Security Status"
            value={mock.security.securityStatus}
          />

          <InfoTile
            label="Password Last Changed"
            value={
              mock.security
                .passwordLastChanged
            }
          />

          <InfoTile
            label="Two-Factor Authentication"
            value={
              mock.security.twoFactorEnabled
                ? "Enabled"
                : "Disabled"
            }
          />

          <InfoTile
            label="Active Sessions"
            value={String(
              mock.security.activeSessions,
            )}
          />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Password
            </p>

            <h2 className="mt-2 text-lg font-black text-[#0B2633]">
              Account password
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/45">
              Change your portal password through the
              secure account security workflow.
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl bg-[#0B2633] px-4 py-3 text-xs font-black text-white"
            >
              Change Password
            </button>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
              Additional Security
            </p>

            <h2 className="mt-2 text-lg font-black text-[#0B2633]">
              Two-Factor Authentication
            </h2>

            <p className="mt-2 text-sm leading-6 text-black/45">
              Add an additional verification step to
              protect your account.
            </p>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F8FBFC] p-4">
              <span className="text-sm font-bold text-[#0B2633]">
                Current status
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-black ${
                  mock.security
                    .twoFactorEnabled
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {mock.security
                  .twoFactorEnabled
                  ? "Enabled"
                  : "Not enabled"}
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (view === "login-history") {
    return (
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Header
          title="Login History"
          description="Review recent sign-in activity associated with your KUHRSA account."
        />

        <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse">
              <thead>
                <tr className="border-b border-black/[0.06] text-left">
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Date
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Time
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Device
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Browser
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Location
                  </th>

                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.13em] text-black/35">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {mock.loginHistory.map(
                  (entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-black/[0.04]"
                    >
                      <td className="px-4 py-4 text-sm text-black/50">
                        {entry.date}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {entry.time}
                      </td>

                      <td className="px-4 py-4 text-sm font-bold text-[#0B2633]">
                        {entry.device}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {entry.browser}
                      </td>

                      <td className="px-4 py-4 text-sm text-black/50">
                        {entry.location}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Header
        title="Settings"
        description="Review your member portal display and regional preferences."
      />

      <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)] sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoTile
            label="Language"
            value={mock.settings.language}
          />

          <InfoTile
            label="Timezone"
            value={mock.settings.timezone}
          />

          <InfoTile
            label="Date Format"
            value={mock.settings.dateFormat}
          />

          <InfoTile
            label="Dashboard Density"
            value={mock.settings.dashboardDensity}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-[#F8FBFC] p-5">
          <p className="text-sm font-black text-[#0B2633]">
            Settings controls
          </p>

          <p className="mt-2 text-xs leading-5 text-black/45">
            These values represent the frontend
            settings design. Production settings will
            be stored against the authenticated account.
          </p>
        </div>
      </section>
    </div>
  );
}
