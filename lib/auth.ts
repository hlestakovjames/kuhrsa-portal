export type PortalType =
  | "member"
  | "executive"
  | "administration";

export type AuthUser = {
  id: string;
  organizationId: string;

  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;

  email: string;
  phone?: string | null;

  status: string;
  isSystemOwner: boolean;
  lastLoginAt?: string | null;

  organization?: {
    id: string;
    name: string;
    code: string;
  } | null;

  member?: {
    id: string;

    registrationNumber?: string | null;
    admissionNumber?: string | null;

    memberNumber: string;
    category: string;

    yearOfStudy?: number | null;
    graduationYear?: number | null;

    nationalId?: string | null;
    staffNumber?: string | null;

    position?: string | null;

    programme?: string | null;
    faculty?: string | null;
    department?: string | null;

    status: string;
    source: string;
    activationStatus: string;
  } | null;

  roles: Array<{
    id: string;
    name: string;
    code: string;
  }>;

  dashboards?: Array<
    "member" |
    "executive" |
    "administration"
  >;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const TOKEN_KEY = "kuhrsa_access_token";

export async function login(
  identifier: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: identifier.trim(),
        password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Unable to sign in. Please check your credentials.",
    );
  }

  if (!data?.accessToken) {
    throw new Error(
      "Authentication succeeded but no access token was returned.",
    );
  }

  setToken(data.accessToken);

  return data as LoginResponse;
}

export async function getMe(): Promise<AuthUser> {
  const token = getToken();

  if (!token) {
    throw new Error("You are not authenticated.");
  }

  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    clearToken();

    throw new Error(
      data?.message ||
        "Your session is no longer valid.",
    );
  }

  return data as AuthUser;
}

export function setToken(
  token: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    TOKEN_KEY,
    token,
  );
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    TOKEN_KEY,
  );
}

export function clearToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    TOKEN_KEY,
  );
}

export function logout() {
  clearToken();
}

export function canAccessPortal(
  user: AuthUser,
  portal: PortalType,
): boolean {
  const roles = new Set(
    user.roles.map(
      (role) => role.code,
    ),
  );

  switch (portal) {
    case "member":
      return (
        user.isSystemOwner ||
        roles.has("MEMBER") ||
        roles.has("EXECUTIVE") ||
        roles.has("ADMINISTRATOR") ||
        roles.has("SUPER_ADMINISTRATOR")
      );

    case "executive":
      return (
        !user.isSystemOwner &&
        roles.has("EXECUTIVE")
      );

    case "administration":
      return (
        user.isSystemOwner ||
        roles.has("ADMINISTRATOR") ||
        roles.has("SUPER_ADMINISTRATOR")
      );

    default:
      return false;
  }
}

export function getLandingPath(
  user: AuthUser,
): string {
  if (user.isSystemOwner) {
    return "/administration/dashboard";
  }

  const roles = new Set(
    user.roles.map(
      (role) => role.code,
    ),
  );

  if (
    roles.has("SUPER_ADMINISTRATOR") ||
    roles.has("ADMINISTRATOR")
  ) {
    return "/administration/dashboard";
  }

  if (roles.has("EXECUTIVE")) {
    return "/executive/dashboard";
  }

  return "/dashboard";
}
