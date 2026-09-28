import Image from "next/image";
import Link from "next/link";

import PortalLoginForm from "@/components/portal/PortalLoginForm";

export default function AdministrationPage() {
  return (
    <main className="min-h-screen bg-[#F4FAFC] px-5 py-12 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-black/5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Brand Panel */}
          <section className="relative hidden overflow-hidden bg-[#F700BA] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white shadow-sm">
                  <Image
                    src="/images/kuhrsa_logo.jpeg"
                    alt="KUHRSA official logo"
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <div className="text-2xl font-black tracking-tight">
                    KUHRSA
                  </div>

                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                    Student Association
                  </div>
                </div>
              </Link>

              <div className="mt-16 max-w-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  Authorized Access
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight">
                  Administration Portal.
                </h2>

                <p className="mt-5 leading-7 text-white/80">
                  A secure access point for authorized KUHRSA administrators
                  responsible for association operations, records, content
                  and administrative functions.
                </p>
              </div>
            </div>

            <p className="text-sm text-white/60">
              Operations, records and administration in one secure environment.
            </p>
          </section>

          {/* Access Panel */}
          <section className="p-6 sm:p-10 lg:p-12">
            {/* Mobile Brand */}
            <div className="mb-8 flex items-center lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/10">
                  <Image
                    src="/images/kuhrsa_logo.jpeg"
                    alt="KUHRSA official logo"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <div className="text-xl font-black tracking-tight text-[#0B2633]">
                    KUHRSA
                  </div>

                  <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#CE26A4]">
                    Student Association
                  </div>
                </div>
              </Link>
            </div>

            <div className="mx-auto max-w-md">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#CE26A4]">
                Administration Access
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0B2633]">
                Welcome back.
              </h1>

              <p className="mt-4 leading-7 text-black/60">
                Sign in to access the KUHRSA Administration Portal.
              </p>

              {/* Security Notice */}
              <div className="mt-7 rounded-2xl bg-[#FFF4FB] p-4 ring-1 ring-[#F700BA]/10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CE26A4]">
                  Authorized Users Only
                </p>

                <p className="mt-2 text-sm leading-6 text-black/55">
                  This portal is restricted to approved KUHRSA administration
                  accounts. Access is controlled by KUHRSA authentication and
                  administrative permissions.
                </p>
              </div>

              <PortalLoginForm
                emailId="admin-email"
                emailPlaceholder="Enter your administration email"
                accent="pink"
                portal="administration"
              />

              {/* Support */}
              <div className="mt-8 border-t border-black/10 pt-6 text-center">
                <p className="text-sm text-black/55">
                  Need administration access help?
                </p>

                <Link
                  href="/contact"
                  className="mt-2 inline-block font-bold text-[#CE26A4] transition hover:text-[#AF218D]"
                >
                  Contact KUHRSA →
                </Link>
              </div>

              {/* Return */}
              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="text-sm font-semibold text-black/45 transition hover:text-[#CE26A4]"
                >
                  ← Back to KUHRSA website
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-black/10 bg-white px-4 py-3 text-center">
                <p className="text-xs leading-5 text-black/45">
                  Administration authentication and role-based permissions are
                  connected to the KUHRSA authentication service.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}