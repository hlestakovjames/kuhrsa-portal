"use client";

import Link from "next/link";

type ContentView =
  | "dashboard"
  | "homepage"
  | "pages"
  | "news"
  | "announcements"
  | "articles"
  | "events"
  | "activities"
  | "media"
  | "gallery"
  | "banners"
  | "social"
  | "publishing";

type Props = {
  view: ContentView;
};

const contentStats = [
  ["Published Items", "86"],
  ["Drafts", "14"],
  ["Scheduled", "9"],
  ["Media Assets", "342"],
];

const news = [
  {
    title: "KUHRSA leadership development programme announced",
    type: "News",
    status: "Published",
  },
  {
    title: "New academic support opportunities available",
    type: "News",
    status: "Draft",
  },
  {
    title: "Student professional networking session",
    type: "News",
    status: "Scheduled",
  },
];

const announcements = [
  {
    title: "Membership registration reminder",
    audience: "All Members",
    status: "Published",
  },
  {
    title: "Upcoming AGM notice",
    audience: "Members",
    status: "Scheduled",
  },
  {
    title: "Executive meeting notice",
    audience: "Executives",
    status: "Draft",
  },
];

const articles = [
  ["Building meaningful student leadership", "Published"],
  ["Professional growth beyond the classroom", "Review"],
  ["Creating stronger student networks", "Draft"],
];

const mediaAssets = [
  ["KUHRSA leadership group", "Image", "Published"],
  ["AGM announcement graphic", "Graphic", "Draft"],
  ["Professional development session", "Image", "Published"],
  ["Membership campaign artwork", "Graphic", "Scheduled"],
];

const publishingQueue = [
  ["Upcoming AGM notice", "Announcement", "17 Sep 2026", "Scheduled"],
  ["Student leadership feature", "Article", "20 Sep 2026", "Review"],
  ["Professional development update", "News", "24 Sep 2026", "Draft"],
];

const pages = [
  ["Homepage", "Published"],
  ["About KUHRSA", "Published"],
  ["Membership", "Published"],
  ["Academic Support", "Published"],
  ["Resources", "Published"],
  ["Contact", "Published"],
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
        Content & Publicity
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
    value === "Published" ||
    value === "Approved";

  const attention =
    value === "Draft" ||
    value === "Scheduled" ||
    value === "Review";

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
        title="Content Dashboard"
        description="Manage KUHRSA website content, publicity, media assets, announcements, news, articles, social content and publishing workflows."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {contentStats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#0B2633]">
                Recent News
              </h2>

              <p className="mt-1 text-sm text-black/40">
                Synthetic editorial content.
              </p>
            </div>

            <Link
              href="/administration/content/news"
              className="text-sm font-black text-[#CE26A4]"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {news.map((item) => (
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
                      {item.type}
                    </p>
                  </div>

                  <Badge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div>
            <h2 className="text-lg font-black text-[#0B2633]">
              Publishing Queue
            </h2>

            <p className="mt-1 text-sm text-black/40">
              Content awaiting publication workflow.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {publishingQueue.map(([title, type, date, status]) => (
              <div
                key={title}
                className="rounded-2xl border border-black/[0.05] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0B2633]">
                      {title}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {type} • {date}
                    </p>
                  </div>

                  <Badge value={status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <h2 className="text-lg font-black text-[#0B2633]">
          Content Operations
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Homepage", "/administration/content/homepage"],
            ["News", "/administration/content/news"],
            ["Announcements", "/administration/content/announcements"],
            ["Media Library", "/administration/content/media"],
            ["Gallery", "/administration/content/gallery"],
            ["Banners", "/administration/content/banners"],
            ["Social Content", "/administration/content/social"],
            ["Publishing", "/administration/content/publishing"],
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
  );
}

function PagesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Pages"
        description="Manage structured pages published on the KUHRSA public website."
      />

      <section className="space-y-3">
        {pages.map(([title, status]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-[#0B2633]">
                {title}
              </p>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function PublishingView() {
  return (
    <div className="space-y-6">
      <Header
        title="Publishing"
        description="Manage content review, scheduling and publication workflows."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Drafts" value="14" />
        <StatCard label="Awaiting Review" value="6" />
        <StatCard label="Scheduled" value="9" />
      </section>

      <section className="space-y-3">
        {publishingQueue.map(([title, type, date, status]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {type} • Target {date}
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

function ContentListView({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: Array<[string, string]>;
}) {
  return (
    <div className="space-y-6">
      <Header title={title} description={description} />

      <section className="space-y-3">
        {data.map(([name, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-[#0B2633]">
                {name}
              </p>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function NewsView() {
  return (
    <div className="space-y-6">
      <Header
        title="News"
        description="Create and manage KUHRSA news content."
      />

      <section className="space-y-3">
        {news.map((item) => (
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
                  {item.type}
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

function AnnouncementsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Announcements"
        description="Manage official KUHRSA announcements and member-facing notices."
      />

      <section className="space-y-3">
        {announcements.map((item) => (
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
                  Audience: {item.audience}
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

function ArticlesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Articles"
        description="Manage long-form editorial and leadership content."
      />

      <section className="space-y-3">
        {articles.map(([title, status]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-[#0B2633]">
                {title}
              </p>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function EventActivityContentView({
  activity = false,
}: {
  activity?: boolean;
}) {
  const title = activity
    ? "Activities Content"
    : "Events Content";

  return (
    <div className="space-y-6">
      <Header
        title={title}
        description={
          activity
            ? "Manage public-facing content associated with KUHRSA activities."
            : "Manage public-facing content associated with KUHRSA events."
        }
      />

      <ContentListView
        title={activity ? "Activity Content Items" : "Event Content Items"}
        description="Synthetic editorial records."
        data={
          activity
            ? [
                ["Student Mentorship Programme", "Published"],
                ["Career Engagement Activity", "Draft"],
                ["Academic Support Initiative", "Scheduled"],
              ]
            : [
                ["AGM & First-Year Welcome", "Published"],
                ["Professional Development Session", "Scheduled"],
                ["Leadership Forum", "Draft"],
              ]
        }
      />
    </div>
  );
}

function MediaView() {
  return (
    <div className="space-y-6">
      <Header
        title="Media Library"
        description="Central repository for approved KUHRSA image and graphic assets."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        {mediaAssets.map(([name, type, status]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {name}
            </p>

            <p className="mt-1 text-xs text-black/40">
              {type} asset
            </p>

            <div className="mt-4">
              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function GalleryView() {
  return (
    <div className="space-y-6">
      <Header
        title="Gallery"
        description="Manage public KUHRSA photo galleries and collections."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Student Leadership", "48 photos"],
          ["Events", "72 photos"],
          ["Activities", "61 photos"],
          ["Academic Community", "39 photos"],
          ["Community Engagement", "54 photos"],
          ["KUHRSA General", "68 photos"],
        ].map(([title, count]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {title}
            </p>

            <p className="mt-2 text-xs text-black/40">
              {count}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function BannersView() {
  return (
    <div className="space-y-6">
      <Header
        title="Banners"
        description="Manage promotional banners and homepage campaign assets."
      />

      <ContentListView
        title="Banner Campaigns"
        description="Synthetic banner records."
        data={[
          ["2026/27 Membership Campaign", "Published"],
          ["AGM & Welcome Campaign", "Scheduled"],
          ["Professional Development Campaign", "Draft"],
          ["Leadership Campaign", "Published"],
        ]}
      />
    </div>
  );
}

function SocialView() {
  return (
    <div className="space-y-6">
      <Header
        title="Social Content"
        description="Prepare and coordinate KUHRSA social media content."
      />

      <ContentListView
        title="Social Queue"
        description="Synthetic social content records."
        data={[
          ["AGM announcement post", "Scheduled"],
          ["Membership reminder", "Published"],
          ["Leadership feature", "Draft"],
          ["Upcoming event promotion", "Review"],
        ]}
      />
    </div>
  );
}

function HomepageView() {
  return (
    <div className="space-y-6">
      <Header
        title="Homepage"
        description="Manage homepage sections, featured content and publication order."
      />

      <section className="grid gap-3 md:grid-cols-2">
        {[
          ["Hero Slider", "Published"],
          ["Featured Events", "Published"],
          ["Latest News", "Published"],
          ["Announcements", "Published"],
          ["Programs", "Published"],
          ["Call-to-Action Blocks", "Review"],
        ].map(([title, status]) => (
          <div
            key={title}
            className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-[#0B2633]">
                {title}
              </p>

              <Badge value={status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function AdministrationContentWorkspace({
  view,
}: Props) {
  switch (view) {
    case "homepage":
      return <HomepageView />;

    case "pages":
      return <PagesView />;

    case "news":
      return <NewsView />;

    case "announcements":
      return <AnnouncementsView />;

    case "articles":
      return <ArticlesView />;

    case "events":
      return <EventActivityContentView />;

    case "activities":
      return <EventActivityContentView activity />;

    case "media":
      return <MediaView />;

    case "gallery":
      return <GalleryView />;

    case "banners":
      return <BannersView />;

    case "social":
      return <SocialView />;

    case "publishing":
      return <PublishingView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
