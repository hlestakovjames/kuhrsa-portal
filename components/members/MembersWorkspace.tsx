"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  logout,
} from "@/lib/auth";

type MemberCategory =
  | "STUDENT"
  | "ALUMNI"
  | "LECTURER";

type MemberStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED"
  | "ARCHIVED";

type MemberActivationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "COMPLETED"
  | "EXPIRED";

type MemberSource =
  | "REGISTRATION"
  | "MANUAL_ENTRY"
  | "MIGRATION_IMPORT"
  | "MIGRATION_MANUAL";

type Member = {
  id: string;
  organizationId: string;
  category: MemberCategory;

  constitutionalCategory:
    | "ORDINARY"
    | "ASSOCIATE"
    | "ALUMNI"
    | "HONORARY";

  goodStandingStatus:
    | "GOOD_STANDING"
    | "NOT_IN_GOOD_STANDING"
    | "EXTENSION_GRANTED";

  financialStatus:
    | "PAID"
    | "PARTIALLY_PAID"
    | "UNPAID"
    | "EXTENSION_GRANTED"
    | "OVERDUE";

  disciplinaryStatus:
    | "CLEAR"
    | "UNDER_REVIEW"
    | "SANCTIONED";

  registrationNumber: string | null;
  admissionNumber: string | null;
  memberNumber: string;

  yearOfStudy: number | null;
  graduationYear: number | null;
  nationalId: string | null;
  staffNumber: string | null;
  position: string | null;

  programme: string | null;
  faculty: string | null;
  department: string | null;

  email: string | null;
  phone: string | null;
  address: string | null;
  county: string | null;

  status: MemberStatus;
  source: MemberSource;
  activationStatus: MemberActivationStatus;

  createdAt: string;
  updatedAt: string;

  organization: {
    id: string;
    name: string;
    code: string;
  } | null;

  user: {
    id: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    email: string;
    status: string;
    isSystemOwner: boolean;
  } | null;
};

type MemberForm = {
  category: MemberCategory;

  firstName: string;
  middleName: string;
  lastName: string;

  registrationNumber: string;

  nationalId: string;
  graduationYear: string;

  yearOfStudy: string;
  programme: string;

  staffNumber: string;
  position: string;

  faculty: string;
  department: string;

  email: string;
  phone: string;
  address: string;
  county: string;
};

type MigrationBatch = {
  id: string;
  fileName: string;
  source: MemberSource;

  status:
    | "UPLOADED"
    | "VALIDATING"
    | "VALIDATED"
    | "IMPORTING"
    | "COMPLETED"
    | "COMPLETED_WITH_ERRORS"
    | "FAILED"
    | "CANCELLED";

  totalRows: number;
  validRows: number;
  invalidRows: number;
  importedRows: number;
  failedRows: number;
  skippedRows: number;
};

type MigrationRow = {
  id: string;
  rowNumber: number;

  status:
    | "PENDING"
    | "VALID"
    | "INVALID"
    | "IMPORTED"
    | "FAILED"
    | "SKIPPED";

  category: MemberCategory | null;

  firstName: string | null;
  middleName: string | null;
  lastName: string | null;

  registrationNumber: string | null;
  nationalId: string | null;
  staffNumber: string | null;

  yearOfStudy: number | null;
  graduationYear: number | null;

  programme: string | null;
  faculty: string | null;
  department: string | null;
  position: string | null;

  email: string | null;
  phone: string | null;
  address: string | null;
  county: string | null;

  memberId: string | null;
  memberNumber: string | null;

  errorCode: string | null;
  errorMessage: string | null;
};

type MigrationBatchDetails =
  MigrationBatch & {
    rows: MigrationRow[];
  };

type MembersView =
  | "registry"
  | "migration";

type PanelMode =
  | "none"
  | "details"
  | "create"
  | "edit";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    "",
  ) ?? "http://localhost:3001";

const EMPTY_FORM: MemberForm = {
  category: "STUDENT",

  firstName: "",
  middleName: "",
  lastName: "",

  registrationNumber: "",

  nationalId: "",
  graduationYear: "",

  yearOfStudy: "",
  programme: "",

  staffNumber: "",
  position: "",

  faculty: "",
  department: "",

  email: "",
  phone: "",
  address: "",
  county: "",
};

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatCategory(
  category: MemberCategory,
) {
  switch (category) {
    case "STUDENT":
      return "Student";

    case "ALUMNI":
      return "Alumni";

    case "LECTURER":
      return "Lecturer";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "en-KE",
    {
      dateStyle: "medium",
    },
  ).format(new Date(value));
}

function getMemberName(
  member: Member,
) {
  const name = [
    member.user?.firstName,
    member.user?.middleName,
    member.user?.lastName,
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(
          value?.trim(),
        ),
    )
    .join(" ")
    .trim();

  return name || "Name not available";
}

function getMemberInitials(
  member: Member,
) {
  const first =
    member.user?.firstName
      ?.trim()
      .charAt(0) ?? "";

  const last =
    member.user?.lastName
      ?.trim()
      .charAt(0) ?? "";

  const initials =
    `${first}${last}`.toUpperCase();

  return initials || "KU";
}

function getAcademicSummary(
  member: Member,
) {
  const items: string[] = [];

  if (member.programme) {
    items.push(member.programme);
  }

  if (
    member.category ===
    "STUDENT" &&
    member.yearOfStudy
  ) {
    items.push(
      `Year ${member.yearOfStudy}`,
    );
  }

  if (
    member.category ===
    "ALUMNI" &&
    member.graduationYear
  ) {
    items.push(
      `Class of ${member.graduationYear}`,
    );
  }

  if (member.position) {
    items.push(member.position);
  }

  return (
    items.join(" · ") ||
    "Academic information not provided"
  );
}

function statusClasses(
  status: MemberStatus,
) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";

    case "PENDING":
      return "bg-amber-50 text-amber-700 ring-amber-600/10";

    case "SUSPENDED":
      return "bg-rose-50 text-rose-700 ring-rose-600/10";

    case "INACTIVE":
      return "bg-slate-100 text-slate-600 ring-slate-500/10";

    case "ARCHIVED":
      return "bg-zinc-100 text-zinc-600 ring-zinc-500/10";

    default:
      return "bg-slate-100 text-slate-600 ring-slate-500/10";
  }
}

function activationClasses(
  status: MemberActivationStatus,
) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "EXPIRED":
      return "bg-rose-50 text-rose-700";

    case "NOT_REQUIRED":
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function sourceLabel(
  source: MemberSource,
) {
  switch (source) {
    case "MIGRATION_IMPORT":
      return "Bulk Migration";

    case "MIGRATION_MANUAL":
      return "Manual Entry";

    case "MANUAL_ENTRY":
      return "Manual Entry";

    case "REGISTRATION":
      return "Registration";
  }
}

function migrationStatusClasses(
  status: MigrationBatch["status"],
) {
  switch (status) {
    case "VALIDATED":
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "COMPLETED_WITH_ERRORS":
      return "bg-amber-50 text-amber-700";

    case "IMPORTING":
    case "VALIDATING":
      return "bg-blue-50 text-blue-700";

    case "FAILED":
    case "CANCELLED":
      return "bg-rose-50 text-rose-700";

    case "UPLOADED":
    default:
      return "bg-slate-100 text-slate-600";
  }
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),

        Authorization: `Bearer ${token}`,

        ...(options.headers ?? {}),
      },

      cache: "no-store",
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (response.status === 401) {
    logout();

    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  if (!response.ok) {
    const message = Array.isArray(
      data?.message,
    )
      ? data.message.join(", ")
      : data?.message;

    throw new Error(
      message ||
        "The request could not be completed.",
    );
  }

  return data as T;
}

async function downloadFile(
  path: string,
  fallbackName: string,
) {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },

      cache: "no-store",
    },
  );

  if (response.status === 401) {
    logout();

    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  if (!response.ok) {
    throw new Error(
      "The file could not be downloaded.",
    );
  }

  const blob =
    await response.blob();

  const disposition =
    response.headers.get(
      "Content-Disposition",
    );

  const match =
    disposition?.match(
      /filename="?([^"]+)"?/i,
    );

  const filename =
    match?.[1] ?? fallbackName;

  const url =
    window.URL.createObjectURL(
      blob,
    );

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href = url;
  anchor.download =
    filename;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  anchor.remove();

  window.URL.revokeObjectURL(
    url,
  );
}

export default function MembersWorkspace() {
  const router = useRouter();

  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [view, setView] =
    useState<MembersView>(
      "registry",
    );

  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState<
    "ALL" | MemberCategory
  >("ALL");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "ALL" | MemberStatus
  >("ALL");

  const [
    activationFilter,
    setActivationFilter,
  ] = useState<
    "ALL" | MemberActivationStatus
  >("ALL");

  const [
    sourceFilter,
    setSourceFilter,
  ] = useState<
    "ALL" | MemberSource
  >("ALL");

  const [
    selectedMember,
    setSelectedMember,
  ] = useState<Member | null>(
    null,
  );

  const [panelMode, setPanelMode] =
    useState<PanelMode>("none");

  const [
    editingMember,
    setEditingMember,
  ] = useState<Member | null>(
    null,
  );

  const [form, setForm] =
    useState<MemberForm>(
      EMPTY_FORM,
    );

  const [
    migrationFile,
    setMigrationFile,
  ] = useState<File | null>(
    null,
  );

  const [
    migrationBatch,
    setMigrationBatch,
  ] =
    useState<MigrationBatchDetails | null>(
      null,
    );

  const [
    migrationLoading,
    setMigrationLoading,
  ] = useState(false);

  const [
    migrationImporting,
    setMigrationImporting,
  ] = useState(false);

  const [
    migrationErrorOnly,
    setMigrationErrorOnly,
  ] = useState(false);

  const loadMembers =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await apiRequest<Member[]>(
            "/members",
          );

        setMembers(data);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to load members.";

        if (
          message
            .toLowerCase()
            .includes("sign in")
        ) {
          router.push("/login");
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    }, [router]);

  useEffect(() => {
    // Synchronize component state with the external Members API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMembers();
  }, [loadMembers]);

  const filteredMembers =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return members.filter(
        (member) => {
          const name =
            getMemberName(
              member,
            ).toLowerCase();

          const matchesSearch =
            !query ||
            name.includes(query) ||
            member.memberNumber
              .toLowerCase()
              .includes(query) ||
            (
              member.registrationNumber ??
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              member.email ??
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              member.user?.email ??
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              member.phone ??
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              member.staffNumber ??
              ""
            )
              .toLowerCase()
              .includes(query) ||
            (
              member.programme ??
              ""
            )
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            categoryFilter === "ALL" ||
            member.category ===
              categoryFilter;

          const matchesStatus =
            statusFilter === "ALL" ||
            member.status ===
              statusFilter;

          const matchesActivation =
            activationFilter ===
              "ALL" ||
            member.activationStatus ===
              activationFilter;

          const matchesSource =
            sourceFilter ===
              "ALL" ||
            member.source ===
              sourceFilter;

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus &&
            matchesActivation &&
            matchesSource
          );
        },
      );
    }, [
      members,
      search,
      categoryFilter,
      statusFilter,
      activationFilter,
      sourceFilter,
    ]);

  const stats = useMemo(() => {
    return {
      total: members.length,

      active: members.filter(
        (member) =>
          member.status ===
          "ACTIVE",
      ).length,

      pending: members.filter(
        (member) =>
          member.status ===
          "PENDING",
      ).length,

      inactive: members.filter(
        (member) =>
          member.status ===
          "INACTIVE",
      ).length,

      suspended: members.filter(
        (member) =>
          member.status ===
          "SUSPENDED",
      ).length,

      activationPending:
        members.filter(
          (member) =>
            member.activationStatus ===
            "PENDING",
        ).length,

      completedActivation:
        members.filter(
          (member) =>
            member.activationStatus ===
            "COMPLETED",
        ).length,

      students: members.filter(
        (member) =>
          member.category ===
          "STUDENT",
      ).length,

      alumni: members.filter(
        (member) =>
          member.category ===
          "ALUMNI",
      ).length,

      lecturers: members.filter(
        (member) =>
          member.category ===
          "LECTURER",
      ).length,

      migrated: members.filter(
        (member) =>
          member.source ===
            "MIGRATION_IMPORT" ||
          member.source ===
            "MIGRATION_MANUAL",
      ).length,

      linkedAccounts:
        members.filter(
          (member) =>
            Boolean(
              member.user,
            ),
        ).length,
    };
  }, [members]);

  function clearMessages() {
    setError("");
    setNotice("");
  }

  function openCreate() {
    clearMessages();

    setView("registry");

    setForm(
      EMPTY_FORM,
    );

    setEditingMember(null);
    setSelectedMember(null);
    setPanelMode("create");
  }

  function openEdit(
    member: Member,
  ) {
    clearMessages();

    setSelectedMember(null);
    setEditingMember(member);

    setForm({
      category: member.category,

      firstName:
        member.user?.firstName ??
        "",

      middleName:
        member.user?.middleName ??
        "",

      lastName:
        member.user?.lastName ??
        "",

      registrationNumber:
        member.registrationNumber ??
        "",

      nationalId:
        member.nationalId ??
        "",

      graduationYear:
        member.graduationYear
          ? String(
              member.graduationYear,
            )
          : "",

      yearOfStudy:
        member.yearOfStudy
          ? String(
              member.yearOfStudy,
            )
          : "",

      programme:
        member.programme ??
        "",

      staffNumber:
        member.staffNumber ??
        "",

      position:
        member.position ??
        "",

      faculty:
        member.faculty ??
        "",

      department:
        member.department ??
        "",

      email:
        member.email ??
        member.user?.email ??
        "",

      phone:
        member.phone ??
        "",

      address:
        member.address ??
        "",

      county:
        member.county ??
        "",
    });

    setPanelMode("edit");
  }

  function closePanel() {
    if (busy) {
      return;
    }

    setPanelMode("none");
    setSelectedMember(null);
    setEditingMember(null);
    setForm(EMPTY_FORM);
  }

  async function openMember(
    member: Member,
  ) {
    clearMessages();

    try {
      const details =
        await apiRequest<Member>(
          `/members/${member.id}`,
        );

      setSelectedMember(
        details,
      );

      setEditingMember(null);
      setPanelMode("details");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load member details.",
      );
    }
  }

  function validateForm() {
    if (!form.firstName.trim()) {
      return "First name is required.";
    }

    if (!form.lastName.trim()) {
      return "Last name is required.";
    }

    if (!form.email.trim()) {
      return "Email address is required for administrative member creation.";
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        form.email.trim(),
      )
    ) {
      return "Please provide a valid email address.";
    }

    if (!form.faculty.trim()) {
      return "Faculty / School is required.";
    }

    if (!form.department.trim()) {
      return "Department is required.";
    }

    if (
      form.category ===
      "STUDENT"
    ) {
      if (
        !form.registrationNumber.trim()
      ) {
        return "Student registration/admission number is required.";
      }

      const year =
        Number(
          form.yearOfStudy,
        );

      if (
        !form.yearOfStudy ||
        !Number.isInteger(
          year,
        ) ||
        year < 1 ||
        year > 4
      ) {
        return "Student year of study must be between 1 and 4.";
      }

      if (!form.programme.trim()) {
        return "Programme is required for students.";
      }
    }

    if (
      form.category ===
      "ALUMNI"
    ) {
      if (!form.nationalId.trim()) {
        return "National ID is required for alumni.";
      }

      const graduationYear =
        Number(
          form.graduationYear,
        );

      if (
        !form.graduationYear ||
        !Number.isInteger(
          graduationYear,
        ) ||
        graduationYear <
          1900 ||
        graduationYear >
          new Date().getFullYear()
      ) {
        return "Please provide a valid graduation year.";
      }

      if (!form.programme.trim()) {
        return "Programme is required for alumni.";
      }
    }

    if (
      form.category ===
      "LECTURER"
    ) {
      if (!form.staffNumber.trim()) {
        return "Staff/employee number is required for lecturers.";
      }

      if (!form.position.trim()) {
        return "Position is required for lecturers.";
      }
    }

    return "";
  }

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError,
      );
      return;
    }

    setBusy(true);
    clearMessages();

    try {
      const payload: Record<
        string,
        unknown
      > = {
        category:
          form.category,

        firstName:
          form.firstName.trim(),

        middleName:
          form.middleName.trim() || null,

        lastName:
          form.lastName.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        faculty:
          form.faculty.trim(),

        department:
          form.department.trim(),

        source:
          "MIGRATION_MANUAL",
      };

      if (
        form.registrationNumber.trim()
      ) {
        payload.registrationNumber =
          form.registrationNumber.trim();
      }

      if (
        form.nationalId.trim()
      ) {
        payload.nationalId =
          form.nationalId.trim();
      }

      if (
        form.graduationYear
      ) {
        payload.graduationYear =
          Number(
            form.graduationYear,
          );
      }

      if (
        form.yearOfStudy
      ) {
        payload.yearOfStudy =
          Number(
            form.yearOfStudy,
          );
      }

      if (
        form.programme.trim()
      ) {
        payload.programme =
          form.programme.trim();
      }

      if (
        form.staffNumber.trim()
      ) {
        payload.staffNumber =
          form.staffNumber.trim();
      }

      if (
        form.position.trim()
      ) {
        payload.position =
          form.position.trim();
      }

      if (
        form.phone.trim()
      ) {
        payload.phone =
          form.phone.trim();
      }

      if (
        form.address.trim()
      ) {
        payload.address =
          form.address.trim();
      }

      if (
        form.county.trim()
      ) {
        payload.county =
          form.county.trim();
      }

      const member =
        await apiRequest<Member>(
          "/members",
          {
            method: "POST",
            body: JSON.stringify(
              payload,
            ),
          },
        );

      setMembers(
        (current) => [
          member,
          ...current,
        ],
      );

      setSelectedMember(
        member,
      );

      setEditingMember(null);

      setForm(
        EMPTY_FORM,
      );

      setPanelMode(
        "details",
      );

      setNotice(
        `${member.memberNumber} was created successfully. The linked account is awaiting activation.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create member.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleEdit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!editingMember) {
      return;
    }

    setBusy(true);
    clearMessages();

    try {
      const payload: Record<
        string,
        string | number | null
      > = {};

      const registrationNumber =
        form.registrationNumber.trim();

      const nationalId =
        form.nationalId.trim();

      const graduationYear =
        form.graduationYear.trim();

      const yearOfStudy =
        form.yearOfStudy.trim();

      const programme =
        form.programme.trim();

      const staffNumber =
        form.staffNumber.trim();

      const position =
        form.position.trim();

      const faculty =
        form.faculty.trim();

      const department =
        form.department.trim();

      const email =
        form.email
          .trim()
          .toLowerCase();

      const phone =
        form.phone.trim();

      const address =
        form.address.trim();

      const county =
        form.county.trim();

      payload.registrationNumber =
        registrationNumber || null;

      payload.nationalId =
        nationalId || null;

      payload.graduationYear =
        graduationYear
          ? Number(graduationYear)
          : null;

      payload.yearOfStudy =
        yearOfStudy
          ? Number(yearOfStudy)
          : null;

      payload.programme =
        programme || null;

      payload.staffNumber =
        staffNumber || null;

      payload.position =
        position || null;

      payload.faculty =
        faculty || null;

      payload.department =
        department || null;

      payload.email =
        email || null;

      payload.phone =
        phone || null;

      payload.address =
        address || null;

      payload.county =
        county || null;

      const updated =
        await apiRequest<Member>(
          `/members/${editingMember.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(
              payload,
            ),
          },
        );

      setMembers(
        (current) =>
          current.map(
            (member) =>
              member.id ===
              updated.id
                ? updated
                : member,
          ),
      );

      setSelectedMember(
        updated,
      );

      setEditingMember(
        null,
      );

      setPanelMode(
        "details",
      );

      setForm(
        EMPTY_FORM,
      );

      setNotice(
        `${updated.memberNumber} was updated successfully.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update member.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusAction(
    member: Member,
    action:
      | "approve"
      | "activate"
      | "suspend",
  ) {
    setBusy(true);
    clearMessages();

    try {
      const updated =
        await apiRequest<Member>(
          `/members/${member.id}/${action}`,
          {
            method: "POST",
            body: JSON.stringify(
              {},
            ),
          },
        );

      setMembers(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              updated.id
                ? updated
                : item,
          ),
      );

      setSelectedMember(
        updated,
      );

      const actionLabel =
        action ===
        "approve"
          ? "approved"
          : action ===
              "activate"
            ? "activated"
            : "suspended";

      setNotice(
        `${updated.memberNumber} was ${actionLabel} successfully.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : `Unable to ${action} member.`,
      );
    } finally {
      setBusy(false);
    }
  }

  function handleMigrationFile(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ??
      null;

    clearMessages();

    if (!file) {
      setMigrationFile(null);
      return;
    }

    const extension =
      file.name
        .toLowerCase()
        .split(".")
        .pop();

    if (
      extension !== "xlsx" &&
      extension !== "csv"
    ) {
      event.target.value = "";
      setMigrationFile(null);

      setError(
        "Only .xlsx and .csv migration files are supported.",
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      event.target.value = "";
      setMigrationFile(null);

      setError(
        "Migration files cannot exceed 10 MB.",
      );

      return;
    }

    setMigrationFile(file);
    setMigrationBatch(null);
  }

  async function uploadMigration() {
    if (!migrationFile) {
      setError(
        "Select a .xlsx or .csv migration file first.",
      );

      return;
    }

    setMigrationLoading(
      true,
    );

    clearMessages();

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        migrationFile,
      );

      const result =
        await apiRequest<{
          message: string;
          batch: MigrationBatch;
        }>(
          "/migrations/upload",
          {
            method: "POST",
            body: formData,
          },
        );

      setNotice(
        result.message,
      );

      const details =
        await apiRequest<MigrationBatchDetails>(
          `/migrations/${result.batch.id}`,
        );

      setMigrationBatch(
        details,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Migration upload failed.",
      );
    } finally {
      setMigrationLoading(
        false,
      );
    }
  }

  async function refreshMigrationBatch() {
    if (!migrationBatch) {
      return;
    }

    setMigrationLoading(
      true,
    );

    clearMessages();

    try {
      const details =
        await apiRequest<MigrationBatchDetails>(
          `/migrations/${migrationBatch.id}`,
        );

      setMigrationBatch(
        details,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to refresh migration status.",
      );
    } finally {
      setMigrationLoading(
        false,
      );
    }
  }

  async function importMigration() {
    if (!migrationBatch) {
      return;
    }

    if (
      migrationBatch.status !==
      "VALIDATED"
    ) {
      setError(
        "Only a fully validated migration batch can be imported.",
      );

      return;
    }

    setMigrationImporting(
      true,
    );

    clearMessages();

    try {
      const result =
        await apiRequest<{
          message: string;
          batch: MigrationBatch;
        }>(
          `/migrations/${migrationBatch.id}/import`,
          {
            method: "POST",
          },
        );

      setNotice(
        result.message,
      );

      const details =
        await apiRequest<MigrationBatchDetails>(
          `/migrations/${migrationBatch.id}`,
        );

      setMigrationBatch(
        details,
      );

      await loadMembers();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Migration import failed.",
      );
    } finally {
      setMigrationImporting(
        false,
      );
    }
  }

  async function downloadTemplate() {
    clearMessages();

    try {
      await downloadFile(
        "/migrations/template",
        "KUHRSA_Member_Migration_Template.xlsx",
      );

      setNotice(
        "Migration template downloaded successfully.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to download the migration template.",
      );
    }
  }

  async function downloadReport() {
    if (!migrationBatch) {
      return;
    }

    clearMessages();

    try {
      await downloadFile(
        `/migrations/${migrationBatch.id}/report`,
        `KUHRSA_Migration_Report_${migrationBatch.id}.xlsx`,
      );

      setNotice(
        "Migration report downloaded successfully.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to download the migration report.",
      );
    }
  }

  const visibleMigrationRows =
    useMemo(() => {
      if (!migrationBatch) {
        return [];
      }

      if (
        !migrationErrorOnly
      ) {
        return migrationBatch.rows;
      }

      return migrationBatch.rows.filter(
        (row) =>
          row.status ===
            "INVALID" ||
          row.status ===
            "FAILED",
      );
    }, [
      migrationBatch,
      migrationErrorOnly,
    ]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#168DB8]">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0B2633] sm:text-4xl">
            Membership Management
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-black/55 sm:text-base">
            Manage complete KUHRSA membership records,
            member accounts, lifecycle status and
            controlled data migration from one
            administration workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#168DB8] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-[#168DB8]/20 transition hover:bg-[#11799D]"
          >
            <span className="text-lg">
              +
            </span>

            Add Member
          </button>

          <button
            type="button"
            onClick={() =>
              setView(
                "migration",
              )
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-[#168DB8]/20 bg-[#168DB8]/5 px-5 py-3.5 text-sm font-black text-[#168DB8] transition hover:bg-[#168DB8]/10"
          >
            <span className="text-lg">
              ↑
            </span>

            Bulk Migration
          </button>
        </div>
      </div>

      {(error || notice) && (
        <div className="mt-6">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold leading-6 text-rose-700">
              {error}
            </div>
          )}

          {notice && !error && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold leading-6 text-emerald-700">
              {notice}
            </div>
          )}
        </div>
      )}

      <div className="mt-7 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
        <WorkspaceTab
          active={
            view === "registry"
          }
          onClick={() =>
            setView(
              "registry",
            )
          }
          label="Member Registry"
          count={members.length}
        />

        <WorkspaceTab
          active={
            view === "migration"
          }
          onClick={() =>
            setView(
              "migration",
            )
          }
          label="Bulk Migration"
        />
      </div>

      {view === "registry" ? (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Members"
              value={stats.total}
              detail="All membership records"
            />

            <StatCard
              label="Active"
              value={stats.active}
              detail="Currently active members"
            />

            <StatCard
              label="Activation Pending"
              value={
                stats.activationPending
              }
              detail="Accounts awaiting activation"
            />

            <StatCard
              label="Linked Accounts"
              value={
                stats.linkedAccounts
              }
              detail="Members with system accounts"
            />
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <CategoryCard
              label="Students"
              value={
                stats.students
              }
              description="Current university students"
            />

            <CategoryCard
              label="Alumni"
              value={
                stats.alumni
              }
              description="Former university students"
            />

            <CategoryCard
              label="Lecturers"
              value={
                stats.lecturers
              }
              description="Academic staff members"
            />
          </section>

          <section className="mt-6 rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#168DB8]">
                    Member Registry
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0B2633]">
                    KUHRSA Membership Records
                  </h2>

                  <p className="mt-1 text-sm text-black/45">
                    {filteredMembers.length} of{" "}
                    {members.length} records shown
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void loadMembers()
                    }
                    disabled={loading}
                    className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-black text-[#0B2633] hover:bg-black/[0.03] disabled:opacity-50"
                  >
                    {loading
                      ? "Refreshing..."
                      : "Refresh"}
                  </button>

                  <button
                    type="button"
                    onClick={openCreate}
                    className="rounded-xl bg-[#168DB8] px-4 py-2.5 text-xs font-black text-white hover:bg-[#11799D]"
                  >
                    + Add Member
                  </button>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.8fr)_repeat(4,minmax(145px,1fr))]">
                <input
                  value={search}
                  onChange={(
                    event,
                  ) =>
                    setSearch(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Search name, member number, identifier, email, phone, programme..."
                  className="h-11 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 text-sm font-medium text-[#0B2633] outline-none placeholder:text-black/30 focus:border-[#168DB8] focus:ring-4 focus:ring-[#168DB8]/10"
                />

                <select
                  value={
                    categoryFilter
                  }
                  onChange={(
                    event,
                  ) =>
                    setCategoryFilter(
                      event.target
                        .value as
                        | "ALL"
                        | MemberCategory,
                    )
                  }
                  className="h-11 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 text-sm font-bold text-[#0B2633] outline-none focus:border-[#168DB8]"
                >
                  <option value="ALL">
                    All Categories
                  </option>

                  <option value="STUDENT">
                    Students
                  </option>

                  <option value="ALUMNI">
                    Alumni
                  </option>

                  <option value="LECTURER">
                    Lecturers
                  </option>
                </select>

                <select
                  value={
                    statusFilter
                  }
                  onChange={(
                    event,
                  ) =>
                    setStatusFilter(
                      event.target
                        .value as
                        | "ALL"
                        | MemberStatus,
                    )
                  }
                  className="h-11 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 text-sm font-bold text-[#0B2633] outline-none focus:border-[#168DB8]"
                >
                  <option value="ALL">
                    All Statuses
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>

                  <option value="SUSPENDED">
                    Suspended
                  </option>

                  <option value="ARCHIVED">
                    Archived
                  </option>
                </select>

                <select
                  value={
                    activationFilter
                  }
                  onChange={(
                    event,
                  ) =>
                    setActivationFilter(
                      event.target
                        .value as
                        | "ALL"
                        | MemberActivationStatus,
                    )
                  }
                  className="h-11 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 text-sm font-bold text-[#0B2633] outline-none focus:border-[#168DB8]"
                >
                  <option value="ALL">
                    All Activation
                  </option>

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="EXPIRED">
                    Expired
                  </option>

                  <option value="NOT_REQUIRED">
                    Not Required
                  </option>
                </select>

                <select
                  value={
                    sourceFilter
                  }
                  onChange={(
                    event,
                  ) =>
                    setSourceFilter(
                      event.target
                        .value as
                        | "ALL"
                        | MemberSource,
                    )
                  }
                  className="h-11 rounded-xl border border-black/10 bg-[#F8FBFC] px-4 text-sm font-bold text-[#0B2633] outline-none focus:border-[#168DB8]"
                >
                  <option value="ALL">
                    All Sources
                  </option>

                  <option value="REGISTRATION">
                    Registration
                  </option>

                  <option value="MIGRATION_IMPORT">
                    Bulk Migration
                  </option>

                  <option value="MIGRATION_MANUAL">
                    Manual Entry
                  </option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <section className="mt-6 grid gap-4 xl:grid-cols-2">
              {Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-72 animate-pulse rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5"
                  />
                ),
              )}
            </section>
          ) : filteredMembers.length ===
            0 ? (
            <section className="mt-6 rounded-[1.75rem] bg-white p-12 text-center shadow-sm ring-1 ring-black/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4FAFC] text-xl font-black text-[#168DB8]">
                M
              </div>

              <h3 className="mt-5 text-xl font-black text-[#0B2633]">
                No members found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                No member records match the current
                search and filters.
              </p>

              <button
                type="button"
                onClick={openCreate}
                className="mt-6 rounded-full bg-[#168DB8] px-5 py-3 text-sm font-black text-white hover:bg-[#11799D]"
              >
                Add Member
              </button>
            </section>
          ) : (
            <section className="mt-6 grid gap-4 xl:grid-cols-2">
              {filteredMembers.map(
                (member) => (
                  <MemberRecordCard
                    key={member.id}
                    member={member}
                    onView={() =>
                      void openMember(
                        member,
                      )
                    }
                    onEdit={() =>
                      openEdit(
                        member,
                      )
                    }
                  />
                ),
              )}
            </section>
          )}
        </>
      ) : (
        <MigrationWorkspace
          migrationFile={
            migrationFile
          }
          migrationBatch={
            migrationBatch
          }
          migrationLoading={
            migrationLoading
          }
          migrationImporting={
            migrationImporting
          }
          migrationErrorOnly={
            migrationErrorOnly
          }
          visibleRows={
            visibleMigrationRows
          }
          onFileChange={
            handleMigrationFile
          }
          onDownloadTemplate={
            () =>
              void downloadTemplate()
          }
          onUpload={
            () =>
              void uploadMigration()
          }
          onRefresh={
            () =>
              void refreshMigrationBatch()
          }
          onImport={
            () =>
              void importMigration()
          }
          onDownloadReport={
            () =>
              void downloadReport()
          }
          onToggleErrors={() =>
            setMigrationErrorOnly(
              (current) =>
                !current,
            )
          }
        />
      )}

      {panelMode !== "none" && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#0B2633]/60 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl sm:max-w-5xl sm:rounded-[2rem]">
            {panelMode ===
              "details" &&
              selectedMember && (
                <MemberDetails
                  member={
                    selectedMember
                  }
                  busy={busy}
                  onClose={
                    closePanel
                  }
                  onEdit={() =>
                    openEdit(
                      selectedMember,
                    )
                  }
                  onApprove={() =>
                    void handleStatusAction(
                      selectedMember,
                      "approve",
                    )
                  }
                  onActivate={() =>
                    void handleStatusAction(
                      selectedMember,
                      "activate",
                    )
                  }
                  onSuspend={() =>
                    void handleStatusAction(
                      selectedMember,
                      "suspend",
                    )
                  }
                />
              )}

            {(panelMode ===
              "create" ||
              panelMode ===
                "edit") && (
              <MemberFormPanel
                editingMember={
                  editingMember
                }
                form={form}
                busy={busy}
                onClose={
                  closePanel
                }
                onChange={
                  setForm
                }
                onSubmit={
                  editingMember
                    ? handleEdit
                    : handleCreate
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkspaceTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition ${
        active
          ? "bg-[#168DB8] text-white"
          : "text-black/50 hover:bg-black/[0.03] hover:text-[#168DB8]"
      }`}
    >
      {label}

      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            active
              ? "bg-white/15 text-white"
              : "bg-black/[0.04] text-black/40"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight text-[#0B2633]">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold text-black/40">
        {detail}
      </p>
    </div>
  );
}

function CategoryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#0B2633]">
            {label}
          </p>

          <p className="mt-1 text-xs font-semibold text-black/40">
            {description}
          </p>
        </div>

        <p className="text-2xl font-black text-[#168DB8]">
          {value}
        </p>
      </div>
    </div>
  );
}

function MemberRecordCard({
  member,
  onView,
  onEdit,
}: {
  member: Member;
  onView: () => void;
  onEdit: () => void;
}) {
  const name =
    getMemberName(
      member,
    );

  const initials =
    getMemberInitials(
      member,
    );

  return (
    <article className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-black/5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#168DB8]/10 text-sm font-black text-[#168DB8]">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-black text-[#0B2633]">
                {name}
              </p>

              <p className="mt-1 text-xs font-bold text-[#168DB8]">
                {
                  member.memberNumber
                }
              </p>

              <p className="mt-1 text-xs text-black/40">
                {formatCategory(
                  member.category,
                )}{" "}
                ·{" "}
                {getAcademicSummary(
                  member,
                )}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black ring-1 ${statusClasses(
              member.status,
            )}`}
          >
            {formatStatus(
              member.status,
            )}
          </span>
        </div>
      </div>

      <div className="grid divide-y divide-black/5 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <RecordBlock
          label="Identification"
          value={
            member.registrationNumber ??
            member.staffNumber ??
            "Not provided"
          }
          detail={
            member.category ===
            "LECTURER"
              ? "Staff / Employee Number"
              : "Registration / Admission Number"
          }
        />

        <RecordBlock
          label="Contact"
          value={
            member.phone ??
            "Phone not provided"
          }
          detail={
            member.email ??
            member.user?.email ??
            "Email not provided"
          }
        />

        <RecordBlock
          label="Academic / Professional"
          value={
            member.faculty ??
            "Faculty not provided"
          }
          detail={
            member.department ??
            member.position ??
            "Department not provided"
          }
        />

        <RecordBlock
          label="Membership"
          value={formatStatus(
            member.activationStatus,
          )}
          detail={`Source: ${sourceLabel(
            member.source,
          )}`}
          accent
        />
      </div>

      <div className="flex items-center justify-between gap-3 bg-[#FBFDFE] px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/30">
            Account
          </p>

          <p className="mt-1 text-xs font-bold text-[#0B2633]">
            {member.user
              ? `${formatStatus(
                  member.user.status,
                )} · Linked`
              : "Not linked"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onView}
            className="rounded-xl border border-black/10 px-3.5 py-2.5 text-xs font-black text-[#0B2633] hover:bg-black/[0.03]"
          >
            View Profile
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl bg-[#168DB8] px-3.5 py-2.5 text-xs font-black text-white hover:bg-[#11799D]"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

function RecordBlock({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div className="p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/30">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm font-black ${
          accent
            ? "text-[#168DB8]"
            : "text-[#0B2633]"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 break-words text-xs font-medium leading-5 text-black/40">
        {detail}
      </p>
    </div>
  );
}

function MemberDetails({
  member,
  busy,
  onClose,
  onEdit,
  onApprove,
  onActivate,
  onSuspend,
}: {
  member: Member;
  busy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onApprove: () => void;
  onActivate: () => void;
  onSuspend: () => void;
}) {
  const name =
    getMemberName(
      member,
    );

  const initials =
    getMemberInitials(
      member,
    );

  return (
    <div>
      <div className="border-b border-black/5 bg-[#FBFDFE] px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#168DB8]/10 text-lg font-black text-[#168DB8] sm:h-20 sm:w-20">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
                Member Profile
              </p>

              <h2 className="mt-1 truncate text-2xl font-black tracking-tight text-[#0B2633] sm:text-3xl">
                {name}
              </h2>

              <p className="mt-1 text-sm font-black text-[#168DB8]">
                {member.memberNumber}
              </p>

              <p className="mt-1 text-xs text-black/40">
                {formatCategory(
                  member.category,
                )}
                {" · "}
                {formatStatus(
                  member.constitutionalCategory,
                )}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black ${statusClasses(
                    member.status,
                  )}`}
                >
                  {formatStatus(
                    member.status,
                  )}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black ${activationClasses(
                    member.activationStatus,
                  )}`}
                >
                  Activation:{" "}
                  {formatStatus(
                    member.activationStatus,
                  )}
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-black/45 ring-1 ring-black/5">
                  {sourceLabel(
                    member.source,
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 text-lg text-black/50 hover:bg-black/[0.03]"
            aria-label="Close member profile"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <ProfileMetric
            label="Membership"
            value={formatStatus(
              member.status,
            )}
          />

          <ProfileMetric
            label="Good Standing"
            value={formatStatus(
              member.goodStandingStatus,
            )}
          />

          <ProfileMetric
            label="Financial"
            value={formatStatus(
              member.financialStatus,
            )}
          />
        </section>

        <ProfileSection
          title="Identity & Membership"
          description="Core identity, membership identifiers, and constitutional classification."
        >
          <ProfileField
            label="Full Name"
            value={name}
          />

          <ProfileField
            label="Member Number"
            value={
              member.memberNumber
            }
          />

          <ProfileField
            label="Portal Category"
            value={formatCategory(
              member.category,
            )}
          />

          <ProfileField
            label="Constitutional Category"
            value={formatStatus(
              member.constitutionalCategory,
            )}
          />

          <ProfileField
            label="Registration Number"
            value={
              member.registrationNumber ??
              "Not provided"
            }
          />

          <ProfileField
            label="Admission Number"
            value={
              member.admissionNumber ??
              "Not provided"
            }
          />

          {member.category ===
            "ALUMNI" && (
            <>
              <ProfileField
                label="National ID"
                value={
                  member.nationalId
                    ? "Protected"
                    : "Not provided"
                }
              />

              <ProfileField
                label="Graduation Year"
                value={
                  member.graduationYear
                    ? String(
                        member.graduationYear,
                      )
                    : "Not provided"
                }
              />
            </>
          )}

          {member.category ===
            "LECTURER" && (
            <>
              <ProfileField
                label="Staff / Employee Number"
                value={
                  member.staffNumber ??
                  "Not provided"
                }
              />

              <ProfileField
                label="Position"
                value={
                  member.position ??
                  "Not provided"
                }
              />
            </>
          )}
        </ProfileSection>

        <ProfileSection
          title="Membership Standing"
          description="Current lifecycle, activation, compliance, financial, and disciplinary states."
        >
          <ProfileField
            label="Lifecycle Status"
            value={formatStatus(
              member.status,
            )}
          />

          <ProfileField
            label="Activation Status"
            value={formatStatus(
              member.activationStatus,
            )}
          />

          <ProfileField
            label="Good Standing"
            value={formatStatus(
              member.goodStandingStatus,
            )}
          />

          <ProfileField
            label="Financial Status"
            value={formatStatus(
              member.financialStatus,
            )}
          />

          <ProfileField
            label="Disciplinary Status"
            value={formatStatus(
              member.disciplinaryStatus,
            )}
          />
        </ProfileSection>

        <ProfileSection
          title="Academic & Professional"
          description="The academic or professional context associated with the membership."
        >
          <ProfileField
            label="Programme"
            value={
              member.programme ??
              "Not provided"
            }
          />

          <ProfileField
            label="Year of Study"
            value={
              member.yearOfStudy
                ? `Year ${member.yearOfStudy}`
                : "Not applicable"
            }
          />

          <ProfileField
            label="Faculty / School"
            value={
              member.faculty ??
              "Not provided"
            }
          />

          <ProfileField
            label="Department"
            value={
              member.department ??
              "Not provided"
            }
          />

          <ProfileField
            label="Professional Position"
            value={
              member.position ??
              "Not provided"
            }
          />
        </ProfileSection>

        <ProfileSection
          title="Contact Information"
          description="Current contact details stored against the membership record."
        >
          <ProfileField
            label="Email"
            value={
              member.email ??
              member.user?.email ??
              "Not provided"
            }
          />

          <ProfileField
            label="Phone"
            value={
              member.phone ??
              "Not provided"
            }
          />

          <ProfileField
            label="County"
            value={
              member.county ??
              "Not provided"
            }
          />

          <ProfileField
            label="Address"
            value={
              member.address ??
              "Not provided"
            }
          />
        </ProfileSection>

        <ProfileSection
          title="Record History"
          description="System metadata showing how and when this membership record was created and updated."
        >
          <ProfileField
            label="Source"
            value={sourceLabel(
              member.source,
            )}
          />

          <ProfileField
            label="Created"
            value={formatDate(
              member.createdAt,
            )}
          />

          <ProfileField
            label="Last Updated"
            value={formatDate(
              member.updatedAt,
            )}
          />
        </ProfileSection>

        <ProfileSection
          title="System Account"
          description="The KUHRSA system identity linked to this membership record."
        >
          <ProfileField
            label="Account Status"
            value={
              member.user
                ? formatStatus(
                    member.user.status,
                  )
                : "Not linked"
            }
          />

          <ProfileField
            label="Account Email"
            value={
              member.user?.email ??
              "Not linked"
            }
          />

          <ProfileField
            label="User ID"
            value={
              member.user?.id ??
              "Not linked"
            }
          />

          <ProfileField
            label="System Owner"
            value={
              member.user?.isSystemOwner
                ? "Yes"
                : "No"
            }
          />
        </ProfileSection>

        <div className="rounded-2xl border border-[#168DB8]/10 bg-[#F6FBFD] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#168DB8]">
            Administration Control
          </p>

          <p className="mt-2 text-sm leading-6 text-black/55">
            Membership state changes are processed by
            the backend and recorded in the KUHRSA audit
            trail. System-controlled identifiers such as
            the member number are not edited manually.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-black/5 pt-6">
          <button
            type="button"
            onClick={onEdit}
            disabled={busy}
            className="rounded-xl border border-black/10 px-4 py-3 text-sm font-black text-[#0B2633] hover:bg-black/[0.03] disabled:opacity-50"
          >
            Edit Member
          </button>

          {member.status ===
            "PENDING" && (
            <button
              type="button"
              onClick={onApprove}
              disabled={busy}
              className="rounded-xl bg-[#168DB8] px-4 py-3 text-sm font-black text-white hover:bg-[#11799D] disabled:opacity-50"
            >
              Approve
            </button>
          )}

          {member.status !==
            "ACTIVE" &&
            member.status !==
              "ARCHIVED" && (
            <button
              type="button"
              onClick={onActivate}
              disabled={busy}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Activate
            </button>
          )}

          {member.status !==
            "SUSPENDED" &&
            member.status !==
              "ARCHIVED" && (
            <button
              type="button"
              onClick={onSuspend}
              disabled={busy}
              className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-black text-white hover:bg-rose-700 disabled:opacity-50"
            >
              Suspend
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F8FBFC] p-5 ring-1 ring-black/5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/30">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function ProfileSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-lg font-black tracking-tight text-[#0B2633]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-black/40">
          {description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F8FBFC] p-4 ring-1 ring-black/5">
      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-black/30">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function MemberFormPanel({
  editingMember,
  form,
  busy,
  onClose,
  onChange,
  onSubmit,
}: {
  editingMember: Member | null;
  form: MemberForm;
  busy: boolean;
  onClose: () => void;
  onChange: (
    value: MemberForm,
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
}) {
  const currentYear =
    new Date().getFullYear();

  function field(
    key: keyof MemberForm,
    value: string,
  ) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="border-b border-black/5 bg-[#FBFDFE] px-6 py-6 sm:px-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
              {editingMember
                ? "Edit Member"
                : "Administrative Member Entry"}
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0B2633] sm:text-3xl">
              {editingMember
                ? editingMember.memberNumber
                : "Add KUHRSA Member"}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-black/45">
              {editingMember
                ? "Edit the membership record using the fields supported by the current member update API. Category and personal identity remain controlled by the original member record."
                : "Create a complete member record. The backend generates the permanent KUHRSA member number and creates the linked MEMBER account."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 text-lg text-black/50 hover:bg-black/[0.03] disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-7 p-6 sm:p-8">
        <section>
          <FormSectionTitle
            number="01"
            title="Membership Category"
            description="Select the category first. The form adapts to the member classification."
          />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                value:
                  "STUDENT" as const,
                label: "Student",
                description:
                  "Current university student",
              },
              {
                value:
                  "ALUMNI" as const,
                label: "Alumni",
                description:
                  "Former university student",
              },
              {
                value:
                  "LECTURER" as const,
                label: "Lecturer",
                description:
                  "Academic / teaching staff",
              },
            ].map(
              (option) => (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  disabled={
                    Boolean(
                      editingMember,
                    ) || busy
                  }
                  onClick={() =>
                    field(
                      "category",
                      option.value,
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    form.category ===
                    option.value
                      ? "border-[#168DB8] bg-[#168DB8]/5 ring-4 ring-[#168DB8]/10"
                      : "border-black/10 bg-white hover:bg-black/[0.02]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <p className="text-sm font-black text-[#0B2633]">
                    {
                      option.label
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/40">
                    {
                      option.description
                    }
                  </p>
                </button>
              ),
            )}
          </div>
        </section>

        <section>
          <FormSectionTitle
            number="02"
            title="Personal Information"
            description="The member identity used across the membership and system account."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormInput
              label="First Name"
              required
              value={
                form.firstName
              }
              onChange={(
                value,
              ) =>
                field(
                  "firstName",
                  value,
                )
              }
              disabled={
                busy ||
                Boolean(
                  editingMember,
                )
              }
              placeholder="First name"
            />

            <FormInput
              label="Middle Name"
              value={
                form.middleName
              }
              onChange={(
                value,
              ) =>
                field(
                  "middleName",
                  value,
                )
              }
              disabled={
                busy ||
                Boolean(
                  editingMember,
                )
              }
              placeholder="Middle name (optional)"
            />

            <FormInput
              label="Last Name"
              required
              value={
                form.lastName
              }
              onChange={(
                value,
              ) =>
                field(
                  "lastName",
                  value,
                )
              }
              disabled={
                busy ||
                Boolean(
                  editingMember,
                )
              }
              placeholder="Last name"
            />
          </div>
        </section>

        <section>
          <FormSectionTitle
            number="03"
            title="Category-Specific Information"
            description="Only the information relevant to the selected member category is displayed."
          />

          {form.category ===
            "STUDENT" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Registration / Admission Number"
                required
                value={
                  form.registrationNumber
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "registrationNumber",
                    value,
                  )
                }
                disabled={busy}
                placeholder="KSU/HR/2024/001"
              />

              <FormSelect
                label="Year of Study"
                required
                value={
                  form.yearOfStudy
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "yearOfStudy",
                    value,
                  )
                }
                disabled={busy}
              >
                <option value="">
                  Select year
                </option>

                <option value="1">
                  Year 1
                </option>

                <option value="2">
                  Year 2
                </option>

                <option value="3">
                  Year 3
                </option>

                <option value="4">
                  Year 4
                </option>
              </FormSelect>

              <FormInput
                label="Programme"
                required
                value={
                  form.programme
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "programme",
                    value,
                  )
                }
                disabled={busy}
                placeholder="BSc Human Resource Management"
              />

              <FormInput
                label="Faculty / School"
                required
                value={
                  form.faculty
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "faculty",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Faculty or School"
              />

              <FormInput
                label="Department"
                required
                value={
                  form.department
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "department",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Department"
              />
            </div>
          )}

          {form.category ===
            "ALUMNI" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="National ID"
                required
                value={
                  form.nationalId
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "nationalId",
                    value,
                  )
                }
                disabled={busy}
                placeholder="National ID number"
              />

              <FormInput
                label="Registration / Admission Number"
                value={
                  form.registrationNumber
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "registrationNumber",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Optional for alumni"
              />

              <FormSelect
                label="Graduation Year"
                required
                value={
                  form.graduationYear
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "graduationYear",
                    value,
                  )
                }
                disabled={busy}
              >
                <option value="">
                  Select year
                </option>

                {Array.from(
                  {
                    length:
                      currentYear -
                      1900 +
                      1,
                  },
                  (
                    _,
                    index,
                  ) => {
                    const year =
                      currentYear -
                      index;

                    return (
                      <option
                        key={
                          year
                        }
                        value={String(
                          year,
                        )}
                      >
                        {year}
                      </option>
                    );
                  },
                )}
              </FormSelect>

              <FormInput
                label="Programme"
                required
                value={
                  form.programme
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "programme",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Programme studied"
              />

              <FormInput
                label="Faculty / School"
                required
                value={
                  form.faculty
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "faculty",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Faculty or School"
              />

              <FormInput
                label="Department"
                required
                value={
                  form.department
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "department",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Department"
              />
            </div>
          )}

          {form.category ===
            "LECTURER" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Staff / Employee Number"
                required
                value={
                  form.staffNumber
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "staffNumber",
                    value,
                  )
                }
                disabled={busy}
                placeholder="STAFF-0001"
              />

              <FormInput
                label="Position"
                required
                value={
                  form.position
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "position",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Lecturer"
              />

              <FormInput
                label="Faculty / School"
                required
                value={
                  form.faculty
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "faculty",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Faculty or School"
              />

              <FormInput
                label="Department"
                required
                value={
                  form.department
                }
                onChange={(
                  value,
                ) =>
                  field(
                    "department",
                    value,
                  )
                }
                disabled={busy}
                placeholder="Department"
              />
            </div>
          )}
        </section>

        <section>
          <FormSectionTitle
            number="04"
            title="Contact Information"
            description="Contact information used by the membership record and linked account."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormInput
              label="Email Address"
              required
              type="email"
              value={
                form.email
              }
              onChange={(
                value,
              ) =>
                field(
                  "email",
                  value,
                )
              }
              disabled={busy}
              placeholder="member@example.com"
            />

            <FormInput
              label="Phone Number"
              value={
                form.phone
              }
              onChange={(
                value,
              ) =>
                field(
                  "phone",
                  value,
                )
              }
              disabled={busy}
              placeholder="07XXXXXXXX"
            />

            <FormInput
              label="County"
              value={
                form.county
              }
              onChange={(
                value,
              ) =>
                field(
                  "county",
                  value,
                )
              }
              disabled={busy}
              placeholder="County"
            />

            <FormInput
              label="Address"
              value={
                form.address
              }
              onChange={(
                value,
              ) =>
                field(
                  "address",
                  value,
                )
              }
              disabled={busy}
              placeholder="Address"
            />
          </div>
        </section>

        {!editingMember && (
          <div className="rounded-2xl border border-[#168DB8]/10 bg-[#F6FBFD] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#168DB8]">
              System Handling
            </p>

            <p className="mt-2 text-sm leading-6 text-black/55">
              The backend automatically generates the
              permanent member number, creates the linked
              user account, assigns the MEMBER role,
              creates a membership activation record and
              records the operation in the audit log.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStatus
                label="Member Number"
                value="Automatic"
              />

              <MiniStatus
                label="System Account"
                value="Created"
              />

              <MiniStatus
                label="Activation"
                value="Pending"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-black/5 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-black/10 px-5 py-3 text-sm font-black text-[#0B2633] hover:bg-black/[0.03] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-[#168DB8] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#168DB8]/15 hover:bg-[#11799D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy
              ? editingMember
                ? "Saving Changes..."
                : "Creating Member..."
              : editingMember
                ? "Save Member Changes"
                : "Create Member Record"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FormSectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#168DB8]/10 text-[10px] font-black text-[#168DB8]">
          {number}
        </span>

        <h3 className="text-lg font-black tracking-tight text-[#0B2633]">
          {title}
        </h3>
      </div>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-black/45">
        {description}
      </p>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-black/40">
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
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={
          placeholder
        }
        required={required}
        disabled={
          disabled
        }
        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#0B2633] outline-none placeholder:text-black/25 transition focus:border-[#168DB8] focus:ring-4 focus:ring-[#168DB8]/10 disabled:bg-black/[0.03] disabled:opacity-60"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-black/40">
        {label}

        {required && (
          <span className="ml-1 text-[#168DB8]">
            *
          </span>
        )}
      </span>

      <select
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        required={required}
        disabled={disabled}
        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-bold text-[#0B2633] outline-none transition focus:border-[#168DB8] focus:ring-4 focus:ring-[#168DB8]/10 disabled:bg-black/[0.03]"
      >
        {children}
      </select>
    </label>
  );
}

function MiniStatus({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-black/5">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/30">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}

function MigrationWorkspace({
  migrationFile,
  migrationBatch,
  migrationLoading,
  migrationImporting,
  migrationErrorOnly,
  visibleRows,
  onFileChange,
  onDownloadTemplate,
  onUpload,
  onRefresh,
  onImport,
  onDownloadReport,
  onToggleErrors,
}: {
  migrationFile: File | null;
  migrationBatch: MigrationBatchDetails | null;
  migrationLoading: boolean;
  migrationImporting: boolean;
  migrationErrorOnly: boolean;
  visibleRows: MigrationRow[];
  onFileChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onDownloadTemplate: () => void;
  onUpload: () => void;
  onRefresh: () => void;
  onImport: () => void;
  onDownloadReport: () => void;
  onToggleErrors: () => void;
}) {
  const validRows =
    migrationBatch?.validRows ??
    0;

  const invalidRows =
    migrationBatch?.invalidRows ??
    0;

  const canImport =
    migrationBatch?.status ===
      "VALIDATED" &&
    validRows > 0;

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#168DB8]">
              Bulk Membership Migration
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0B2633] sm:text-3xl">
              Import existing KUHRSA members safely.
            </h2>

            <p className="mt-3 text-sm leading-7 text-black/50">
              Download the official migration template,
              prepare the records, upload the file and
              review validation results before anything
              is imported into the membership registry.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onDownloadTemplate
            }
            className="shrink-0 rounded-2xl border border-[#168DB8]/20 bg-[#168DB8]/5 px-5 py-3.5 text-sm font-black text-[#168DB8] hover:bg-[#168DB8]/10"
          >
            Download Template
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/35">
            01 · Upload
          </p>

          <h3 className="mt-2 text-xl font-black text-[#0B2633]">
            Select migration file
          </h3>

          <p className="mt-2 text-sm leading-6 text-black/45">
            Supported formats: Excel (.xlsx) and CSV.
            Maximum file size: 10 MB and maximum 10,000
            member rows.
          </p>

          <label className="mt-6 block cursor-pointer rounded-2xl border-2 border-dashed border-[#168DB8]/20 bg-[#F8FBFC] p-7 text-center transition hover:border-[#168DB8]/40 hover:bg-[#F4FAFC]">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={
                onFileChange
              }
              className="sr-only"
            />

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#168DB8]/10 text-xl text-[#168DB8]">
              ↑
            </div>

            <p className="mt-4 text-sm font-black text-[#0B2633]">
              {migrationFile
                ? migrationFile.name
                : "Choose an Excel or CSV file"}
            </p>

            <p className="mt-1 text-xs text-black/35">
              Click to browse from your computer
            </p>
          </label>

          {migrationFile && (
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#F6FBFD] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0B2633]">
                  {
                    migrationFile.name
                  }
                </p>

                <p className="mt-1 text-xs text-black/35">
                  {(
                    migrationFile.size /
                    1024 /
                    1024
                  ).toFixed(
                    2,
                  )}{" "}
                  MB
                </p>
              </div>

              <button
                type="button"
                onClick={
                  onUpload
                }
                disabled={
                  migrationLoading
                }
                className="shrink-0 rounded-xl bg-[#168DB8] px-4 py-2.5 text-xs font-black text-white hover:bg-[#11799D] disabled:opacity-50"
              >
                {migrationLoading
                  ? "Validating..."
                  : "Upload & Validate"}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] bg-[#0B2633] p-6 text-white sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
            Migration Process
          </p>

          <div className="mt-6 space-y-4">
            {[
              [
                "01",
                "Prepare",
                "Use the official KUHRSA template.",
              ],
              [
                "02",
                "Validate",
                "Every row is checked against membership rules and existing records.",
              ],
              [
                "03",
                "Review",
                "Inspect invalid rows before importing anything.",
              ],
              [
                "04",
                "Import",
                "Only a fully validated batch can be imported.",
              ],
              [
                "05",
                "Track",
                "Imported and failed records remain in the batch history.",
              ],
            ].map(
              (item) => (
                <div
                  key={item[0]}
                  className="flex gap-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[10px] font-black text-white/65">
                    {
                      item[0]
                    }
                  </div>

                  <div>
                    <p className="text-sm font-black text-white">
                      {
                        item[1]
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {
                        item[2]
                      }
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {migrationBatch && (
        <>
          <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5">
            <div className="border-b border-black/5 p-6 sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#168DB8]">
                    Migration Batch
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#0B2633]">
                    {migrationBatch.fileName}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-black/35">
                    Batch ID:{" "}
                    {
                      migrationBatch.id
                    }
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[11px] font-black ${migrationStatusClasses(
                      migrationBatch.status,
                    )}`}
                  >
                    {formatStatus(
                      migrationBatch.status,
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={
                      onRefresh
                    }
                    disabled={
                      migrationLoading ||
                      migrationImporting
                    }
                    className="rounded-xl border border-black/10 px-4 py-2.5 text-xs font-black text-[#0B2633] hover:bg-black/[0.03] disabled:opacity-50"
                  >
                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={
                      onDownloadReport
                    }
                    disabled={
                      migrationLoading
                    }
                    className="rounded-xl border border-[#168DB8]/20 bg-[#168DB8]/5 px-4 py-2.5 text-xs font-black text-[#168DB8] hover:bg-[#168DB8]/10"
                  >
                    Download Report
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-black/5 sm:grid-cols-2 lg:grid-cols-6">
              <MigrationStat
                label="Total"
                value={
                  migrationBatch.totalRows
                }
              />

              <MigrationStat
                label="Valid"
                value={
                  migrationBatch.validRows
                }
                positive
              />

              <MigrationStat
                label="Invalid"
                value={
                  migrationBatch.invalidRows
                }
                negative={
                  invalidRows >
                  0
                }
              />

              <MigrationStat
                label="Imported"
                value={
                  migrationBatch.importedRows
                }
              />

              <MigrationStat
                label="Failed"
                value={
                  migrationBatch.failedRows
                }
                negative={
                  migrationBatch.failedRows >
                  0
                }
              />

              <MigrationStat
                label="Skipped"
                value={
                  migrationBatch.skippedRows
                }
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5">
            <div className="border-b border-black/5 p-6 sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#168DB8]">
                    Validation Review
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#0B2633]">
                    Review migration records
                  </h3>

                  <p className="mt-1 text-sm text-black/45">
                    {visibleRows.length} rows displayed
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={
                      onToggleErrors
                    }
                    className={`rounded-xl px-4 py-2.5 text-xs font-black ${
                      migrationErrorOnly
                        ? "bg-rose-50 text-rose-700"
                        : "border border-black/10 text-[#0B2633]"
                    }`}
                  >
                    {migrationErrorOnly
                      ? "Showing Errors"
                      : "Show Errors Only"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      onImport
                    }
                    disabled={
                      !canImport ||
                      migrationImporting
                    }
                    className="rounded-xl bg-[#168DB8] px-5 py-2.5 text-xs font-black text-white hover:bg-[#11799D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {migrationImporting
                      ? "Importing..."
                      : "Import Validated Batch"}
                  </button>
                </div>
              </div>
            </div>

            {visibleRows.length ===
            0 ? (
              <div className="p-12 text-center">
                <p className="text-sm font-bold text-[#0B2633]">
                  No validation rows to display.
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Upload and validate a migration file to populate
                  this review area.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1450px]">
                  <thead>
                    <tr className="border-b border-black/5 bg-[#F8FBFC] text-left">
                      <TableHead>
                        Row
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                      <TableHead>
                        Name
                      </TableHead>

                      <TableHead>
                        Category
                      </TableHead>

                      <TableHead>
                        Identification
                      </TableHead>

                      <TableHead>
                        Academic / Professional
                      </TableHead>

                      <TableHead>
                        Contact
                      </TableHead>

                      <TableHead>
                        Validation
                      </TableHead>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleRows.map(
                      (row) => (
                        <tr
                          key={
                            row.id
                          }
                          className="border-b border-black/5 last:border-0"
                        >
                          <td className="px-5 py-4 text-sm font-black text-[#0B2633]">
                            {
                              row.rowNumber
                            }
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-black ${
                                row.status ===
                                "VALID"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : row.status ===
                                      "IMPORTED"
                                    ? "bg-blue-50 text-blue-700"
                                    : row.status ===
                                        "INVALID" ||
                                        row.status ===
                                          "FAILED"
                                      ? "bg-rose-50 text-rose-700"
                                      : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {formatStatus(
                                row.status,
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-[#0B2633]">
                              {[
                                row.firstName,
                                row.middleName,
                                row.lastName,
                              ]
                                .filter(
                                  Boolean,
                                )
                                .join(
                                  " ",
                                ) ||
                                "Unnamed"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-black/60">
                            {row.category
                              ? formatCategory(
                                  row.category,
                                )
                              : "—"}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-black/60">
                              {row.registrationNumber ??
                                row.staffNumber ??
                                "—"}
                            </p>

                            {row.nationalId && (
                              <p className="mt-1 text-[10px] font-semibold text-black/30">
                                National ID protected
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-black/60">
                              {row.programme ??
                                row.position ??
                                "—"}
                            </p>

                            <p className="mt-1 text-[11px] text-black/35">
                              {row.department ??
                                row.faculty ??
                                "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-black/60">
                              {
                                row.email
                              }
                            </p>

                            <p className="mt-1 text-[11px] text-black/35">
                              {
                                row.phone
                              }
                            </p>
                          </td>

                          <td className="max-w-[360px] px-5 py-4">
                            {row.errorCode ? (
                              <div>
                                <p className="text-xs font-black text-rose-700">
                                  {
                                    row.errorCode
                                  }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-rose-600/75">
                                  {
                                    row.errorMessage
                                  }
                                </p>
                              </div>
                            ) : row.status === "VALID" ? (
                              <span className="text-xs font-semibold text-emerald-600">
                                Ready for import
                              </span>
                            ) : row.status === "IMPORTED" ? (
                              <div>
                                <p className="text-xs font-black text-blue-700">
                                  Imported successfully
                                </p>

                                {row.memberNumber && (
                                  <p className="mt-1 text-[11px] font-semibold text-black/40">
                                    Member No. {row.memberNumber}
                                  </p>
                                )}
                              </div>
                            ) : row.status === "SKIPPED" ? (
                              <span className="text-xs font-semibold text-slate-500">
                                Skipped
                              </span>
                            ) : row.status === "FAILED" ? (
                              <span className="text-xs font-semibold text-rose-600">
                                Import failed
                              </span>
                            ) : (
                              <span className="text-xs font-semibold text-black/35">
                                Awaiting validation
                              </span>
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {migrationBatch.status ===
              "VALIDATED" && (
              <div className="border-t border-black/5 bg-emerald-50 px-6 py-4 text-sm font-semibold text-emerald-700">
                All migration rows passed validation. The batch is ready to import.
              </div>
            )}

            {(migrationBatch.status ===
              "UPLOADED" ||
              migrationBatch.status ===
                "VALIDATING" ||
              migrationBatch.status ===
                "IMPORTING") && (
              <div className="border-t border-black/5 bg-[#FFFCF5] px-6 py-4 text-sm text-amber-700">
                Import becomes available only after the backend reports the entire batch as fully validated.
              </div>
            )}

            {migrationBatch.status ===
              "COMPLETED" && (
              <div className="border-t border-black/5 bg-emerald-50 px-6 py-4 text-sm font-semibold text-emerald-700">
                Migration completed successfully. Imported members are now in the membership registry.
              </div>
            )}

            {migrationBatch.status ===
              "COMPLETED_WITH_ERRORS" && (
              <div className="border-t border-black/5 bg-amber-50 px-6 py-4 text-sm font-semibold text-amber-700">
                Migration completed with errors. Review the failed rows and download the migration report for details.
              </div>
            )}

            {migrationBatch.status ===
              "FAILED" && (
              <div className="border-t border-black/5 bg-rose-50 px-6 py-4 text-sm font-semibold text-rose-700">
                Migration failed. Review the row errors and download the migration report for details.
              </div>
            )}

            {migrationBatch.status ===
              "CANCELLED" && (
              <div className="border-t border-black/5 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-600">
                This migration batch was cancelled and cannot be imported.
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function MigrationStat({
  label,
  value,
  positive = false,
  negative = false,
}: {
  label: string;
  value: number;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="bg-white p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${
          positive
            ? "text-emerald-600"
            : negative
              ? "text-rose-600"
              : "text-[#0B2633]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableHead({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-black/35">
      {children}
    </th>
  );
}