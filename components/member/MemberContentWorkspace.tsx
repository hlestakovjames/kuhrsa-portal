"use client";

import Link from "next/link";

import { memberContentMock } from "@/lib/mock/member-content";

type ContentView =
  | "announcements"
  | "news"
  | "blog"
  | "resources"
  | "downloads";

type MemberContentWorkspaceProps = {
  view: ContentView;
};

const mock = memberContentMock;

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
        Content & Resources
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

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full bg-[#168DB8]/10 px-2.5 py-1 text-[10px] font-black text-[#168DB8]">
      {children}
    </span>
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

export default function MemberContentWorkspace({
  view,
}: MemberContentWorkspaceProps) {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {view === "announcements" && (
        <>
          <Header
            title="Announcements"
            description="Read current KUHRSA announcements and member notices."
          />

          <section className="mt-6 space-y-4">
            {mock.announcements.map(
              (announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>
                          {announcement.category}
                        </Badge>

                        <span className="text-[10px] font-bold text-black/30">
                          {announcement.date}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-black text-[#0B2633]">
                        {announcement.title}
                      </h2>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/50">
                        {announcement.excerpt}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                      {announcement.status}
                    </span>
                  </div>
                </article>
              ),
            )}
          </section>
        </>
      )}

      {view === "news" && (
        <>
          <Header
            title="News"
            description="Stay informed about KUHRSA activities, opportunities and developments."
          />

          <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mock.news.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)] transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Badge>
                  {article.category}
                </Badge>

                <p className="mt-3 text-[10px] font-bold text-black/30">
                  {article.date}
                </p>

                <h2 className="mt-2 text-lg font-black leading-6 text-[#0B2633]">
                  {article.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-black/45">
                  {article.excerpt}
                </p>

                <Link
                  href="/dashboard/content/news"
                  className="mt-5 inline-flex text-xs font-black text-[#168DB8]"
                >
                  Read article →
                </Link>
              </article>
            ))}
          </section>
        </>
      )}

      {view === "blog" && (
        <>
          <Header
            title="Blog"
            description="Explore KUHRSA perspectives, insights and student stories."
          />

          <section className="mt-6 grid gap-5 lg:grid-cols-3">
            {mock.blog.map((article) => (
              <article
                key={article.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
              >
                <Badge>
                  {article.category}
                </Badge>

                <h2 className="mt-4 text-lg font-black leading-6 text-[#0B2633]">
                  {article.title}
                </h2>

                <p className="mt-2 text-xs font-semibold text-black/35">
                  {article.author} · {article.date}
                </p>

                <p className="mt-4 text-sm leading-6 text-black/45">
                  {article.excerpt}
                </p>

                <Link
                  href="/dashboard/content/blog"
                  className="mt-5 inline-flex text-xs font-black text-[#168DB8]"
                >
                  Read story →
                </Link>
              </article>
            ))}
          </section>
        </>
      )}

      {view === "resources" && (
        <>
          <Header
            title="Resources"
            description="Access useful KUHRSA guides and member resources."
          />

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mock.resources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(11,38,51,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <Badge>
                    {resource.category}
                  </Badge>

                  <span className="text-[10px] font-black text-black/30">
                    {resource.format}
                  </span>
                </div>

                <h2 className="mt-4 text-lg font-black text-[#0B2633]">
                  {resource.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-black/45">
                  {resource.description}
                </p>

                <p className="mt-4 text-[10px] font-bold text-black/30">
                  Updated {resource.updated}
                </p>

                <button
                  type="button"
                  className="mt-5 rounded-xl border border-black/10 px-4 py-2.5 text-xs font-black text-[#0B2633] transition hover:bg-black/[0.03]"
                >
                  Open Resource
                </button>
              </div>
            ))}
          </section>
        </>
      )}

      {view === "downloads" && (
        <>
          <Header
            title="Downloads"
            description="Access member forms, documents and guides available for download."
          />

          <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
            <div className="divide-y divide-black/[0.05]">
              {mock.downloads.map((download) => (
                <div
                  key={download.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#168DB8]/10 text-xs font-black text-[#168DB8]">
                      {download.format}
                    </div>

                    <div>
                      <p className="text-sm font-black text-[#0B2633]">
                        {download.title}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        {download.category} ·{" "}
                        {download.size}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl bg-[#0B2633] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#123747]"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(11,38,51,0.04)]">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#168DB8]">
          Quick Access
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ActionLink
            href="/dashboard/content/announcements"
            label="Announcements"
          />

          <ActionLink
            href="/dashboard/content/news"
            label="News"
          />

          <ActionLink
            href="/dashboard/content/resources"
            label="Resources"
          />

          <ActionLink
            href="/dashboard/content/downloads"
            label="Downloads"
          />
        </div>
      </section>
    </div>
  );
}
