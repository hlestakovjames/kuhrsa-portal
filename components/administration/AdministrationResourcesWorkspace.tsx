"use client";

import Link from "next/link";

type ResourcesView =
  | "dashboard"
  | "documents"
  | "downloads"
  | "certificates"
  | "certificate-verification"
  | "member-documents"
  | "templates"
  | "categories";

type Props = {
  view: ResourcesView;
};

const stats = [
  ["Documents", "428"],
  ["Downloads", "96"],
  ["Certificates", "684"],
  ["Member Documents", "1,172"],
];

const documents = [
  {
    name: "KUHRSA Constitution",
    category: "Governance",
    status: "Published",
  },
  {
    name: "Membership Policy",
    category: "Membership",
    status: "Published",
  },
  {
    name: "Events Planning Guide",
    category: "Events",
    status: "Review",
  },
  {
    name: "Executive Handbook",
    category: "Leadership",
    status: "Published",
  },
];

const downloads = [
  ["Membership Application Form", "Forms", "Available"],
  ["Event Registration Form", "Forms", "Available"],
  ["Membership Guide", "Guides", "Available"],
  ["Executive Meeting Template", "Templates", "Available"],
  ["Event Report Template", "Templates", "Review"],
];

const certificates = [
  {
    title: "Leadership Participation Certificate",
    recipient: "KUHRSA-STD-0042",
    issued: "07 Sep 2026",
    status: "Issued",
  },
  {
    title: "Professional Development Certificate",
    recipient: "KUHRSA-STD-0077",
    issued: "05 Sep 2026",
    status: "Issued",
  },
  {
    title: "Activity Participation Certificate",
    recipient: "KUHRSA-ALU-0018",
    issued: "03 Sep 2026",
    status: "Pending",
  },
];

const memberDocuments = [
  ["KUHRSA-STD-0042", "Membership application", "Verified"],
  ["KUHRSA-STD-0077", "Student identification", "Verified"],
  ["KUHRSA-ALU-0018", "Alumni confirmation", "Review"],
  ["KUHRSA-LCT-0009", "Lecturer confirmation", "Verified"],
];

const templates = [
  ["Official Letter Template", "Secretariat", "Active"],
  ["Meeting Minutes Template", "Governance", "Active"],
  ["Event Report Template", "Events", "Active"],
  ["Financial Report Template", "Finance", "Active"],
  ["Certificate Template", "Certificates", "Draft"],
];

const categories = [
  ["Governance", "48 documents"],
  ["Membership", "76 documents"],
  ["Finance", "52 documents"],
  ["Events & Activities", "89 documents"],
  ["Academic", "64 documents"],
  ["Communication", "43 documents"],
  ["Templates", "31 documents"],
  ["General", "25 documents"],
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
        Resources & Documents
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
    value === "Verified" ||
    value === "Issued" ||
    value === "Available" ||
    value === "Active";

  const attention =
    value === "Review" ||
    value === "Pending" ||
    value === "Draft";

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
        title="Resource Library"
        description="Central administration workspace for KUHRSA documents, downloads, certificates, member documents and reusable templates."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#0B2633]">
                Recent Documents
              </h2>

              <p className="mt-1 text-sm text-black/40">
                Synthetic resource records.
              </p>
            </div>

            <Link
              href="/administration/resources/documents"
              className="text-sm font-black text-[#CE26A4]"
            >
              View all →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {documents.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-[#F8FBFC] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0B2633]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      {item.category}
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
            Resource Operations
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Documents", "/administration/resources/documents"],
              ["Downloads", "/administration/resources/downloads"],
              ["Certificates", "/administration/resources/certificates"],
              [
                "Certificate Verification",
                "/administration/resources/certificates/verification",
              ],
              [
                "Member Documents",
                "/administration/resources/member-documents",
              ],
              ["Templates", "/administration/resources/templates"],
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
          Resource Categories
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map(([name, count]) => (
            <Link
              key={name}
              href="/administration/resources/categories"
              className="rounded-2xl bg-[#F8FBFC] p-4 transition hover:bg-[#FFF7FC]"
            >
              <p className="text-sm font-black text-[#0B2633]">
                {name}
              </p>

              <p className="mt-1 text-xs text-black/40">
                {count}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Documents"
        description="Manage official KUHRSA documents and controlled administrative records."
      />

      <section className="space-y-3">
        {documents.map((item) => (
          <div
            key={item.name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.category}
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

function DownloadsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Downloads"
        description="Manage downloadable forms, guides, documents and approved resources."
      />

      <section className="space-y-3">
        {downloads.map(([name, category, status]) => (
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
                  {category}
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

function CertificatesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Certificates"
        description="Manage certificates issued to members and participants."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Issued" value="684" />
        <StatCard label="Pending" value="18" />
        <StatCard label="Verification Requests" value="27" />
      </section>

      <section className="space-y-3">
        {certificates.map((item) => (
          <div
            key={`${item.title}-${item.recipient}`}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  {item.recipient} • Issued {item.issued}
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

function CertificateVerificationView() {
  return (
    <div className="space-y-6">
      <Header
        title="Certificate Verification"
        description="Verify certificate references and confirm authentic KUHRSA-issued records."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="rounded-2xl bg-[#F8FBFC] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
            Verification Workspace
          </p>

          <p className="mt-2 text-sm font-black text-[#0B2633]">
            Certificate verification interface
          </p>

          <p className="mt-2 text-sm leading-6 text-black/50">
            The future verification service will validate a secure certificate
            reference or QR token against the KUHRSA backend.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        {certificates.map((item) => (
          <div
            key={`${item.title}-${item.recipient}`}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-[#0B2633]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Recipient: {item.recipient}
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl border border-black/[0.08] px-4 py-2 text-xs font-black text-[#0B2633]"
              >
                Verify
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function MemberDocumentsView() {
  return (
    <div className="space-y-6">
      <Header
        title="Member Documents"
        description="Review documents submitted in support of KUHRSA membership records."
      />

      <section className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06]">
                {[
                  "Member Number",
                  "Document",
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
              {memberDocuments.map(([member, document, status]) => (
                <tr
                  key={`${member}-${document}`}
                  className="border-b border-black/[0.05] last:border-0"
                >
                  <td className="px-3 py-4 text-sm font-black text-[#0B2633] first:pl-0">
                    {member}
                  </td>

                  <td className="px-3 py-4 text-xs text-black/55">
                    {document}
                  </td>

                  <td className="px-3 py-4">
                    <Badge value={status} />
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

function TemplatesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Templates"
        description="Manage reusable KUHRSA administrative document and communication templates."
      />

      <section className="space-y-3">
        {templates.map(([name, category, status]) => (
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
                  {category}
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

function CategoriesView() {
  return (
    <div className="space-y-6">
      <Header
        title="Document Categories"
        description="Organize KUHRSA resources into controlled document categories."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map(([name, count]) => (
          <div
            key={name}
            className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.06]"
          >
            <p className="text-sm font-black text-[#0B2633]">
              {name}
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

export default function AdministrationResourcesWorkspace({
  view,
}: Props) {
  switch (view) {
    case "documents":
      return <DocumentsView />;

    case "downloads":
      return <DownloadsView />;

    case "certificates":
      return <CertificatesView />;

    case "certificate-verification":
      return <CertificateVerificationView />;

    case "member-documents":
      return <MemberDocumentsView />;

    case "templates":
      return <TemplatesView />;

    case "categories":
      return <CategoriesView />;

    case "dashboard":
    default:
      return <DashboardView />;
  }
}
