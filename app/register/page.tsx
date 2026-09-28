"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Category = "STUDENT" | "ALUMNI" | "LECTURER";

type FormData = {
  category: Category;

  firstName: string;
  lastName: string;

  registrationNumber: string;
  yearOfStudy: string;

  nationalId: string;
  graduationYear: string;

  staffNumber: string;
  position: string;

  programme: string;
  faculty: string;
  department: string;

  email: string;
  phone: string;
  address: string;
  county: string;

  acceptTerms: boolean;
};

type RegistrationResponse = {
  message: string;

  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    status: string;
  };

  member: {
    id: string;
    memberNumber: string;
    category: string;
    registrationNumber: string | null;
    admissionNumber: string | null;
    yearOfStudy: number | null;
    graduationYear: number | null;
    staffNumber: string | null;
    position: string | null;
    programme: string | null;
    faculty: string | null;
    department: string | null;
    status: string;
    source: string;
    activationStatus: string;
  };

  membership: {
    membershipYear: string;
    startsAt: string;
    endsAt: string;
    status: string;
  };

};

type ApiErrorResponse = {
  message?: string | string[] | Record<string, unknown>;
  error?: string;
  statusCode?: number;
  code?: string;
};

type ReviewRow = readonly [string, string];

const CURRENT_YEAR = new Date().getFullYear();

const initialForm: FormData = {
  category: "STUDENT",

  firstName: "",
  lastName: "",

  registrationNumber: "",
  yearOfStudy: "",

  nationalId: "",
  graduationYear: "",

  staffNumber: "",
  position: "",

  programme: "",
  faculty: "",
  department: "",

  email: "",
  phone: "",
  address: "",
  county: "",

  acceptTerms: false,
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  "http://localhost:3001";

const steps = [
  {
    number: 1,
    title: "Category",
    description: "Choose your KUHRSA membership category.",
  },
  {
    number: 2,
    title: "Personal",
    description: "Tell us about yourself.",
  },
  {
    number: 3,
    title: "Membership",
    description: "Provide your category-specific details.",
  },
  {
    number: 4,
    title: "Contact",
    description: "How can KUHRSA reach you?",
  },
  {
    number: 5,
    title: "Review",
    description: "Check your information.",
  },
  {
    number: 6,
    title: "Submitted",
    description: "Your registration has been submitted.",
  },
];

const categoryOptions: Array<{
  value: Category;
  title: string;
  description: string;
  shortCode: string;
}> = [
  {
    value: "STUDENT",
    title: "Student",
    description:
      "For currently enrolled Kisii University students.",
    shortCode: "S",
  },
  {
    value: "ALUMNI",
    title: "Alumni",
    description:
      "For graduates and former Kisii University students.",
    shortCode: "A",
  },
  {
    value: "LECTURER",
    title: "Lecturer",
    description:
      "For Kisii University academic and teaching staff.",
    shortCode: "L",
  },
];

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getReadableCategory(category: Category) {
  switch (category) {
    case "STUDENT":
      return "Student";
    case "ALUMNI":
      return "Alumni";
    case "LECTURER":
      return "Lecturer";
    default:
      return category;
  }
}

function getApiErrorMessage(payload: ApiErrorResponse) {
  if (
    payload &&
    typeof payload.message === "object" &&
    !Array.isArray(payload.message)
  ) {
    const nestedCode =
      typeof payload.message.code === "string"
        ? payload.message.code
        : undefined;

    const nestedMessage =
      typeof payload.message.message === "string"
        ? payload.message.message
        : undefined;

    if (nestedCode) {
      return mapBackendErrorCode(nestedCode);
    }

    if (nestedMessage) {
      return nestedMessage;
    }
  }

  if (typeof payload.code === "string") {
    return mapBackendErrorCode(payload.code);
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(" ");
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (typeof payload.error === "string") {
    return payload.error;
  }

  return "Registration could not be completed. Please try again.";
}

function mapBackendErrorCode(code: string) {
  switch (code) {
    case "EMAIL_IN_USE":
      return "This email address is already registered.";

    case "PHONE_IN_USE":
      return "This phone number is already registered.";

    case "MEMBER_IDENTIFIER_IN_USE":
      return "This registration/admission number is already registered.";

    case "NATIONAL_ID_IN_USE":
      return "This National ID is already associated with a KUHRSA member.";

    case "STAFF_NUMBER_IN_USE":
      return "This staff number is already registered.";

    case "INVALID_YEAR_OF_STUDY":
      return "Student year of study must be between Year 1 and Year 4.";

    case "INVALID_GRADUATION_YEAR":
      return `Please provide a valid graduation year between 2020 and ${CURRENT_YEAR}.`;

    default:
      return "The information provided could not be accepted. Please review your details and try again.";
  }
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialForm);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] =
    useState<RegistrationResponse | null>(null);

  const currentStep = steps[step - 1];


  const membershipRows: ReviewRow[] = (() => {
    const rows: ReviewRow[] = [];

    if (form.category === "STUDENT") {
      rows.push(
        [
          "Registration / Admission No.",
          form.registrationNumber,
        ],
        [
          "Year of Study",
          `Year ${form.yearOfStudy}`,
        ],
        [
          "Programme",
          form.programme,
        ],
      );
    }

    if (form.category === "ALUMNI") {
      rows.push(
        [
          "National ID",
          form.nationalId,
        ],
        [
          "Registration No.",
          form.registrationNumber || "—",
        ],
        [
          "Graduation Year",
          form.graduationYear,
        ],
        [
          "Programme",
          form.programme,
        ],
      );
    }

    if (form.category === "LECTURER") {
      rows.push(
        [
          "Staff No.",
          form.staffNumber,
        ],
        [
          "Position",
          form.position,
        ],
      );
    }

    rows.push(
      [
        "Faculty / School",
        form.faculty,
      ],
      [
        "Department",
        form.department,
      ],
    );

    return rows;
  })();

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function validateStep(currentStep: Step) {
    setError("");

    if (currentStep === 1) {
      if (!form.category) {
        setError(
          "Please select a membership category.",
        );
        return false;
      }
    }

    if (currentStep === 2) {
      if (
        !form.firstName.trim() ||
        !form.lastName.trim()
      ) {
        setError(
          "First name and last name are required.",
        );
        return false;
      }
    }

    if (currentStep === 3) {
      if (form.category === "STUDENT") {
        if (!form.registrationNumber.trim()) {
          setError(
            "University registration / admission number is required.",
          );
          return false;
        }

        if (
          !["1", "2", "3", "4"].includes(
            form.yearOfStudy,
          )
        ) {
          setError(
            "Please select a valid year of study.",
          );
          return false;
        }

        if (!form.programme.trim()) {
          setError("Programme is required.");
          return false;
        }
      }

      if (form.category === "ALUMNI") {
        if (!form.nationalId.trim()) {
          setError(
            "National ID is required for alumni.",
          );
          return false;
        }

        if (!form.graduationYear) {
          setError("Graduation year is required.");
          return false;
        }

        const graduationYear =
          Number(form.graduationYear);

        if (
          graduationYear < 2020 ||
          graduationYear > CURRENT_YEAR
        ) {
          setError(
            `Graduation year must be between 2020 and ${CURRENT_YEAR}.`,
          );
          return false;
        }

        if (!form.programme.trim()) {
          setError("Programme is required.");
          return false;
        }
      }

      if (form.category === "LECTURER") {
        if (!form.staffNumber.trim()) {
          setError(
            "Staff / Employee Number is required.",
          );
          return false;
        }

        if (!form.position.trim()) {
          setError("Position is required.");
          return false;
        }
      }

      if (!form.faculty.trim()) {
        setError("Faculty / School is required.");
        return false;
      }

      if (!form.department.trim()) {
        setError("Department is required.");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!form.email.trim()) {
        setError("Email address is required.");
        return false;
      }

      if (
        !/^\S+@\S+\.\S+$/.test(
          form.email.trim(),
        )
      ) {
        setError(
          "Please provide a valid email address.",
        );
        return false;
      }

      if (!form.phone.trim()) {
        setError("Phone number is required.");
        return false;
      }
    }

    if (currentStep === 5) {
      if (!form.acceptTerms) {
        setError(
          "You must accept the KUHRSA terms and conditions.",
        );
        return false;
      }
    }

    return true;
  }

  function goNext() {
    if (!validateStep(step)) {
      return;
    }

    setStep((current) =>
      current < 6
        ? ((current + 1) as Step)
        : current,
    );
  }

  function goBack() {
    setError("");

    setStep((current) =>
      current > 1
        ? ((current - 1) as Step)
        : current,
    );
  }

  async function submitRegistration() {
    if (!validateStep(5)) {
      setStep(5);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payloadToSubmit = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),

        category: form.category,

        registrationNumber:
          form.registrationNumber.trim() || undefined,

        yearOfStudy:
          form.category === "STUDENT"
            ? Number(form.yearOfStudy)
            : undefined,

        graduationYear:
          form.category === "ALUMNI"
            ? Number(form.graduationYear)
            : undefined,

        nationalId:
          form.category === "ALUMNI"
            ? form.nationalId.trim()
            : undefined,

        staffNumber:
          form.category === "LECTURER"
            ? form.staffNumber.trim()
            : undefined,

        position:
          form.category === "LECTURER"
            ? form.position.trim()
            : undefined,

        programme:
          form.category === "STUDENT" ||
          form.category === "ALUMNI"
            ? form.programme.trim()
            : undefined,

        faculty: form.faculty.trim(),
        department: form.department.trim(),

        email: form.email
          .trim()
          .toLowerCase(),

        phone: form.phone.trim(),

        address:
          form.address.trim() || undefined,

        county:
          form.county.trim() || undefined,

      };

      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            payloadToSubmit,
          ),
        },
      );

      const payload =
        (await response.json()) as
          | RegistrationResponse
          | ApiErrorResponse;

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            payload as ApiErrorResponse,
          ),
        );
      }

      setRegistration(
        payload as RegistrationResponse,
      );

      setStep(6);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Registration could not be completed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (step === 6) {
      await submitRegistration();
      return;
    }

    if (step < 6) {
      goNext();
    }
  }

  return (
    <main className="min-h-screen bg-[#F4FAFC] text-[#0B2633]">
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="KUHRSA home"
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white shadow-sm">
              <Image
                src="/images/kuhrsa_logo.jpeg"
                alt="KUHRSA official logo"
                fill
                sizes="44px"
                className="object-contain p-1"
                priority
              />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-[#0B2633]">
                KUHRSA
              </div>

              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#168DB8]">
                Membership Registration
              </div>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-[#0B2633]/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#0B2633] transition hover:border-[#168DB8] hover:text-[#168DB8]"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm lg:h-fit">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#168DB8]">
              KUHRSA
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight">
              Join KUHRSA
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/55">
              Complete your membership registration
              in a few simple steps.
            </p>

            <div className="mt-6 space-y-2">
              {steps.map((item) => {
                const active =
                  item.number === step;

                const completed =
                  item.number < step;

                return (
                  <button
                    key={item.number}
                    type="button"
                    onClick={() => {
                      if (
                        item.number < step &&
                        !submitting
                      ) {
                        setError("");
                        setStep(
                          item.number as Step,
                        );
                      }
                    }}
                    disabled={
                      item.number >= step ||
                      submitting
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-[#0B2633] text-white"
                        : completed
                          ? "bg-[#EAF7FB] text-[#0B2633]"
                          : "text-black/45"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        active
                          ? "bg-[#168DB8] text-white"
                          : completed
                            ? "bg-[#168DB8] text-white"
                            : "bg-black/5 text-black/45"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : item.number}
                    </span>

                    <span>
                      <span className="block text-sm font-black">
                        {item.title}
                      </span>

                      <span
                        className={`mt-0.5 block text-[11px] ${
                          active
                            ? "text-white/60"
                            : "text-black/40"
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
            <div className="border-b border-black/5 px-6 py-6 sm:px-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
                    Step {step} of 6
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                    {currentStep.title}
                  </h2>

                  <p className="mt-1 text-sm text-black/50">
                    {currentStep.description}
                  </p>
                </div>

                <div className="w-full sm:w-48">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wide text-black/40">
                    <span>Progress</span>

                    <span>
                      {Math.round(
                        (step / 6) * 100,
                      )}
                      %
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-black/5">
                    <div
                      className="h-full rounded-full bg-[#168DB8] transition-all"
                      style={{
                        width: `${(step / 6) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-7 sm:px-8 sm:py-8">
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <p className="text-sm font-semibold text-black/55">
                      Select the category that best
                      describes your KUHRSA membership.
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      {categoryOptions.map(
                        (option) => {
                          const selected =
                            form.category ===
                            option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                updateField(
                                  "category",
                                  option.value,
                                )
                              }
                              className={`rounded-3xl border p-5 text-left transition ${
                                selected
                                  ? "border-[#168DB8] bg-[#EAF7FB] ring-2 ring-[#168DB8]/20"
                                  : "border-black/10 hover:border-[#168DB8]/40 hover:bg-[#F8FCFD]"
                              }`}
                            >
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${
                                  selected
                                    ? "bg-[#168DB8] text-white"
                                    : "bg-[#0B2633]/5 text-[#0B2633]"
                                }`}
                              >
                                {option.shortCode}
                              </div>

                              <h3 className="mt-5 text-lg font-black">
                                {option.title}
                              </h3>

                              <p className="mt-2 text-sm leading-6 text-black/50">
                                {option.description}
                              </p>

                              <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#168DB8]">
                                <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                    selected
                                      ? "border-[#168DB8] bg-[#168DB8] text-white"
                                      : "border-black/20"
                                  }`}
                                >
                                  {selected
                                    ? "✓"
                                    : ""}
                                </span>

                                {selected
                                  ? "Selected"
                                  : "Select"}
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="First Name"
                      required
                      value={form.firstName}
                      onChange={(value) =>
                        updateField(
                          "firstName",
                          value,
                        )
                      }
                      placeholder="Enter first name"
                    />

                    <Field
                      label="Last Name"
                      required
                      value={form.lastName}
                      onChange={(value) =>
                        updateField(
                          "lastName",
                          value,
                        )
                      }
                      placeholder="Enter last name"
                    />

                    <div className="sm:col-span-2 rounded-2xl bg-[#F4FAFC] p-5">
                      <p className="text-sm font-black text-[#0B2633]">
                        Personal information
                      </p>

                      <p className="mt-1 text-sm leading-6 text-black/50">
                        Use your official names as they
                        should appear on your KUHRSA
                        membership record.
                      </p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
                        {getReadableCategory(
                          form.category,
                        )}
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        Category-specific information
                      </h3>
                    </div>

                    {form.category === "STUDENT" && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="University Registration / Admission Number"
                          required
                          value={
                            form.registrationNumber
                          }
                          onChange={(value) =>
                            updateField(
                              "registrationNumber",
                              value,
                            )
                          }
                          placeholder="e.g. KSU/XXX/0001"
                        />

                        <SelectField
                          label="Year of Study"
                          required
                          value={
                            form.yearOfStudy
                          }
                          onChange={(value) =>
                            updateField(
                              "yearOfStudy",
                              value,
                            )
                          }
                          options={[
                            {
                              value: "1",
                              label: "Year 1",
                            },
                            {
                              value: "2",
                              label: "Year 2",
                            },
                            {
                              value: "3",
                              label: "Year 3",
                            },
                            {
                              value: "4",
                              label: "Year 4",
                            },
                          ]}
                          placeholder="Select year"
                        />

                        <Field
                          label="Programme"
                          required
                          value={form.programme}
                          onChange={(value) =>
                            updateField(
                              "programme",
                              value,
                            )
                          }
                          placeholder="e.g. BSc ICT"
                        />
                      </div>
                    )}

                    {form.category === "ALUMNI" && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="National ID"
                          required
                          value={form.nationalId}
                          onChange={(value) =>
                            updateField(
                              "nationalId",
                              value,
                            )
                          }
                          placeholder="Enter National ID"
                        />

                        <Field
                          label="Registration Number"
                          value={
                            form.registrationNumber
                          }
                          onChange={(value) =>
                            updateField(
                              "registrationNumber",
                              value,
                            )
                          }
                          placeholder="Optional"
                        />

                        <SelectField
                          label="Graduation Year"
                          required
                          value={
                            form.graduationYear
                          }
                          onChange={(value) =>
                            updateField(
                              "graduationYear",
                              value,
                            )
                          }
                          options={Array.from(
                            {
                              length:
                                CURRENT_YEAR -
                                2020 +
                                1,
                            },
                            (_, index) => {
                              const year =
                                CURRENT_YEAR -
                                index;

                              return {
                                value:
                                  String(year),
                                label:
                                  String(year),
                              };
                            },
                          )}
                          placeholder="Select graduation year"
                        />

                        <Field
                          label="Programme"
                          required
                          value={form.programme}
                          onChange={(value) =>
                            updateField(
                              "programme",
                              value,
                            )
                          }
                          placeholder="e.g. BSc ICT"
                        />
                      </div>
                    )}

                    {form.category === "LECTURER" && (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="Staff / Employee Number"
                          required
                          value={form.staffNumber}
                          onChange={(value) =>
                            updateField(
                              "staffNumber",
                              value,
                            )
                          }
                          placeholder="e.g. STAFF-0001"
                        />

                        <Field
                          label="Position"
                          required
                          value={form.position}
                          onChange={(value) =>
                            updateField(
                              "position",
                              value,
                            )
                          }
                          placeholder="e.g. Lecturer"
                        />
                      </div>
                    )}

                    <div className="border-t border-black/5 pt-6">
                      <p className="text-sm font-black">
                        University / Department Details
                      </p>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <Field
                          label="Faculty / School"
                          required
                          value={form.faculty}
                          onChange={(value) =>
                            updateField(
                              "faculty",
                              value,
                            )
                          }
                          placeholder="Enter faculty or school"
                        />

                        <Field
                          label="Department"
                          required
                          value={form.department}
                          onChange={(value) =>
                            updateField(
                              "department",
                              value,
                            )
                          }
                          placeholder="Enter department"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Email Address"
                      required
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        updateField(
                          "email",
                          value,
                        )
                      }
                      placeholder="you@example.com"
                    />

                    <Field
                      label="Phone Number"
                      required
                      value={form.phone}
                      onChange={(value) =>
                        updateField(
                          "phone",
                          value,
                        )
                      }
                      placeholder="07XX XXX XXX"
                    />

                    <Field
                      label="Address"
                      value={form.address}
                      onChange={(value) =>
                        updateField(
                          "address",
                          value,
                        )
                      }
                      placeholder="Town / postal address"
                    />

                    <Field
                      label="County"
                      value={form.county}
                      onChange={(value) =>
                        updateField(
                          "county",
                          value,
                        )
                      }
                      placeholder="e.g. Kisii"
                    />
                  </div>
                )}

                {step === 5 && (
                  <div className="mx-auto max-w-3xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#168DB8]">
                      Final review
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                      Review your registration
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
                      Confirm your information before submitting your KUHRSA
                      membership registration.
                    </p>

                    <div className="mt-7 grid gap-5 md:grid-cols-2">
                      <ReviewCard
                        title="Personal Information"
                        rows={[
                          [
                            "Name",
                            `${form.firstName} ${form.lastName}`,
                          ],
                          [
                            "Category",
                            getReadableCategory(form.category),
                          ],
                          [
                            "Registration Number",
                            form.registrationNumber || "—",
                          ],
                        ]}
                      />

                      <ReviewCard
                        title="Contact"
                        rows={[
                          ["Email", form.email],
                          ["Phone", form.phone],
                          ["County", form.county || "—"],
                        ]}
                      />

                      <div className="md:col-span-2">
                        <ReviewCard
                          title="Membership"
                          rows={membershipRows}
                        />
                      </div>
                    </div>

                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#F4FAFC] p-4">
                      <input
                        type="checkbox"
                        checked={form.acceptTerms}
                        onChange={(event) =>
                          updateField(
                            "acceptTerms",
                            event.target.checked,
                          )
                        }
                        className="mt-1 h-4 w-4 accent-[#168DB8]"
                      />

                      <span className="text-sm leading-6 text-black/55">
                        I confirm that the information provided is accurate and
                        I agree to abide by the applicable KUHRSA terms,
                        membership rules and registration requirements.
                      </span>
                    </label>

                    <div className="mt-6 rounded-3xl border border-[#168DB8]/10 bg-[#F4FAFC] p-5">
                      <p className="text-sm font-black text-[#0B2633]">
                        Activation comes next
                      </p>

                      <p className="mt-2 text-sm leading-6 text-black/50">
                        Registration does not create your password or process
                        payment. After submitting, use the Login page to
                        activate your membership and create your account
                        password.
                      </p>
                    </div>
                  </div>
                )}

                {step === 6 && registration && (
                  <div className="mx-auto max-w-3xl">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7FB] text-2xl text-[#168DB8]">
                        ✓
                      </div>

                      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#168DB8]">
                        Registration submitted
                      </p>

                      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        Welcome to KUHRSA
                      </h2>

                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-black/50">
                        Your membership registration has been received
                        successfully. Your next step is to activate your
                        membership and create your KUHRSA account password.
                      </p>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                      <StatusCard
                        label="Member Number"
                        value={registration.member.memberNumber}
                      />

                      <StatusCard
                        label="Membership Category"
                        value={getReadableCategory(form.category)}
                      />

                      <StatusCard
                        label="Registration Status"
                        value={registration.member.status}
                      />

                      <StatusCard
                        label="Account Status"
                        value={registration.user.status}
                      />

                      <StatusCard
                        label="Membership Period"
                        value={registration.membership.membershipYear}
                      />
                    </div>

                    <div className="mt-6 rounded-3xl border border-[#168DB8]/10 bg-white p-6 text-center shadow-sm">
                      <p className="text-sm font-black text-[#0B2633]">
                        Next: Activate your membership
                      </p>

                      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-black/50">
                        Go to Login and select Activate Membership. Your
                        registration has already been recorded, so you do not
                        need to register again.
                      </p>

                      <div className="mt-5">
                        <Link
                          href="/login"
                          className="inline-flex rounded-full bg-[#0B2633] px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#168DB8]"
                        >
                          Go to Login &amp; Activate
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {step < 6 && (
                <div className="flex flex-col-reverse gap-3 border-t border-black/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1 || submitting}
                    className="rounded-full border border-black/10 px-6 py-3 text-xs font-black uppercase tracking-wide text-[#0B2633] transition hover:border-[#168DB8] hover:text-[#168DB8] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Back
                  </button>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {step === 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (validateStep(5)) {
                            setStep(6);
                          }
                        }}
                        disabled={submitting}
                        className="rounded-full border border-[#168DB8]/20 bg-[#EAF7FB] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#168DB8] transition hover:bg-[#DDF3F8] disabled:opacity-60"
                      >
                        Review
                      </button>
                    )}

                    {step !== 5 && (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-[#0B2633] px-7 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#168DB8] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {step === 6
                          ? submitting
                            ? "Submitting..."
                            : "Submit Registration"
                          : "Continue"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-black/55">
        {label}

        {required && (
          <span className="ml-1 text-[#168DB8]">
            *
          </span>
        )}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-[#0B2633] outline-none transition placeholder:text-black/25 focus:border-[#168DB8] focus:ring-4 focus:ring-[#168DB8]/10"
      />
    </label>
  );
}

function SelectField({
  label,
  required = false,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-black/55">
        {label}

        {required && (
          <span className="ml-1 text-[#168DB8]">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-[#0B2633] outline-none transition focus:border-[#168DB8] focus:ring-4 focus:ring-[#168DB8]/10"
      >
        <option value="">
          {placeholder ?? "Select"}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReviewCard({
  title,
  rows,
}: {
  title: string;
  rows: ReviewRow[];
}) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-[#0B2633]">
        {title}
      </p>

      <div className="mt-4 divide-y divide-black/5">
        {rows.map(([label, value]) => (
          <div
            key={`${title}-${label}`}
            className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span className="text-xs font-semibold text-black/40">
              {label}
            </span>

            <span className="text-right text-xs font-bold text-[#0B2633]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}