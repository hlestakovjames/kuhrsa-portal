"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  getLandingPath,
  login,
} from "@/lib/auth";

type AccessMode =
  | "login"
  | "activate";

type ActivationStep =
  | 1
  | 2
  | 3
  | 4
  | 5;

type ActivationLookupResponse = {
  exists: boolean;
  eligible: boolean;
  code:
    | "ELIGIBLE"
    | "ALREADY_ACTIVE"
    | "ACTIVATION_NOT_AVAILABLE";
  message: string;
  activationToken?: string;
  activationExpiresAt?: string;
  member: {
    id: string;
    memberNumber: string;
    category: string;
    registrationNumber: string | null;
    admissionNumber: string | null;
    activationStatus: string;
  };
};

type ActivationVerificationResponse = {
  verified: boolean;
  code:
    | "VERIFIED"
    | "ALREADY_ACTIVE";
  message: string;
  member: {
    id: string;
    memberNumber: string;
    category: string;
    activationStatus: string;
  };
  payment: {
    required: boolean;
    reason: "INITIAL_REGISTRATION" | "EXISTING_MEMBER";
  };
};

type ActivationResponse = {
  success?: boolean;
  message: string;
  member?: {
    id: string;
    memberNumber: string;
    category: string;
    activationStatus: string;
  };
  user?: {
    id: string;
    status: string;
  };
};

type ApiErrorResponse = {
  message?:
    | string
    | string[]
    | Record<string, unknown>;
  error?: string;
  code?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    "",
  ) ?? "http://localhost:3001";

const activationSteps = [
  {
    number: 1,
    label: "Identify",
  },
  {
    number: 2,
    label: "Verify",
  },
  {
    number: 3,
    label: "Payment",
  },
  {
    number: 4,
    label: "Account",
  },
  {
    number: 5,
    label: "Complete",
  },
] as const;

function mapErrorCode(code: string) {
  switch (code) {
    case "MEMBER_NOT_FOUND":
      return "No matching KUHRSA membership record was found. Check the identifier, email address and phone number.";

    case "MEMBER_ACCOUNT_NOT_LINKED":
      return "This KUHRSA membership has not yet been linked to a user account.";

    case "ALREADY_ACTIVE":
      return "Your KUHRSA account is already active. Please use the Login option.";

    case "VERIFICATION_FAILED":
      return "The details provided do not match the KUHRSA membership record.";

    case "ACTIVATION_NOT_AVAILABLE":
      return "This KUHRSA membership is not currently eligible for activation.";

    default:
      return "We could not complete the request. Please check your details and try again.";
  }
}

function getErrorMessage(
  payload: ApiErrorResponse,
) {
  if (
    payload &&
    typeof payload.message === "object" &&
    !Array.isArray(payload.message)
  ) {
    const nestedMessage =
      typeof payload.message.message ===
      "string"
        ? payload.message.message
        : undefined;

    const nestedCode =
      typeof payload.message.code ===
      "string"
        ? payload.message.code
        : undefined;

    if (nestedCode) {
      return mapErrorCode(
        nestedCode,
      );
    }

    if (nestedMessage) {
      return nestedMessage;
    }
  }

  if (
    typeof payload.code ===
    "string"
  ) {
    return mapErrorCode(
      payload.code,
    );
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(
      " ",
    );
  }

  if (
    typeof payload.message ===
    "string"
  ) {
    return payload.message;
  }

  if (
    typeof payload.error ===
    "string"
  ) {
    return payload.error;
  }

  return "We could not complete the request. Please check your details and try again.";
}

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] =
    useState<AccessMode>("login");

  const [
    loginIdentifier,
    setLoginIdentifier,
  ] = useState("");

  const [
    loginPassword,
    setLoginPassword,
  ] = useState("");

  const [
    loginError,
    setLoginError,
  ] = useState("");

  const [
    loginLoading,
    setLoginLoading,
  ] = useState(false);

  const [
    activationStep,
    setActivationStep,
  ] = useState<ActivationStep>(1);

  const [
    activationError,
    setActivationError,
  ] = useState("");

  const [
    paymentRequired,
    setPaymentRequired,
  ] = useState(false);

  const [
    paymentStepCompleted,
    setPaymentStepCompleted,
  ] = useState(false);

  const [
    activationToken,
    setActivationToken,
  ] = useState("");

  const [
    activationRecord,
    setActivationRecord,
  ] =
    useState<ActivationLookupResponse | null>(
      null,
    );

  const [
    activationResult,
    setActivationResult,
  ] =
    useState<ActivationResponse | null>(
      null,
    );

  const [
    activationLoading,
    setActivationLoading,
  ] = useState(false);

  const [activation, setActivation] =
    useState({
      identifier: "",
      email: "",
      phone: "",

      registrationNumber: "",
      membershipNumber: "",

      firstName: "",
      lastName: "",
      admissionNumber: "",

      password: "",
      confirmPassword: "",
      acceptTerms: false,

      paymentMethod: "M-Pesa",
      mpesaNumber: "",
    });

  const updateActivation = <
    K extends keyof typeof activation
  >(
    field: K,
    value: (typeof activation)[K],
  ) => {
    setActivation(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    setActivationError("");
  };

  const changeMode = (
    nextMode: AccessMode,
  ) => {
    setMode(nextMode);
    setActivationError("");
    setLoginError("");
    setActivationStep(1);
    setActivationToken("");
    setActivationRecord(null);
    setActivationResult(null);
    setPaymentRequired(false);
    setPaymentStepCompleted(false);
  };

  const handleMemberLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoginError("");

    if (
      !loginIdentifier.trim() ||
      !loginPassword
    ) {
      setLoginError(
        "Enter your email or registration number and password.",
      );
      return;
    }

    setLoginLoading(true);

    try {
      const result = await login(
        loginIdentifier,
        loginPassword,
      );

      const hasPortalAccess =
        result.user.isSystemOwner ||
        result.user.roles.some(
          (role) =>
            role.code === "MEMBER" ||
            role.code === "EXECUTIVE" ||
            role.code ===
              "ADMINISTRATOR" ||
            role.code ===
              "SUPER_ADMINISTRATOR",
        );

      if (!hasPortalAccess) {
        throw new Error(
          "Your account does not have active KUHRSA portal access.",
        );
      }

      router.replace(
        getLandingPath(
          result.user,
        ),
      );
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const validateActivationStep = (
    currentStep: ActivationStep,
  ) => {
    if (currentStep === 1) {
      if (
        !activation.identifier.trim() ||
        !activation.email.trim() ||
        !activation.phone.trim()
      ) {
        return "Enter your registration or membership number, email address and phone number.";
      }

      if (
        !/^\S+@\S+\.\S+$/.test(
          activation.email.trim(),
        )
      ) {
        return "Please provide a valid email address.";
      }
    }

    if (currentStep === 2) {
      if (
        !activation.firstName.trim() ||
        !activation.lastName.trim()
      ) {
        return "Please provide your first and last name.";
      }

      if (
        activationRecord?.member
          .admissionNumber &&
        !activation.admissionNumber.trim()
      ) {
        return "Please confirm your admission number.";
      }
    }

    if (currentStep === 4) {
      if (
        !activation.password ||
        !activation.confirmPassword
      ) {
        return "Please create and confirm your password.";
      }

      if (
        activation.password.length <
        8
      ) {
        return "Your password must contain at least 8 characters.";
      }

      if (
        activation.password !==
        activation.confirmPassword
      ) {
        return "Your passwords do not match.";
      }

      if (!activation.acceptTerms) {
        return "Please accept the KUHRSA terms and privacy statement.";
      }
    }

    if (
      currentStep === 3 &&
      paymentRequired && !paymentStepCompleted
    ) {
      if (!activation.paymentMethod) {
        return "Please select a payment method.";
      }

      if (
        activation.paymentMethod ===
          "M-Pesa" &&
        !activation.mpesaNumber.trim()
      ) {
        return "Please enter the M-Pesa number to use for payment.";
      }
    }

    return "";
  };

  const lookupMembership =
    async () => {
      const error =
        validateActivationStep(1);

      if (error) {
        setActivationError(
          error,
        );
        return false;
      }

      setActivationLoading(true);
      setActivationError("");
      setActivationRecord(null);
      setActivationToken("");
      setActivationResult(null);

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/membership-activation/lookup`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                identifier:
                  activation.identifier.trim(),

                email:
                  activation.email
                    .trim()
                    .toLowerCase(),

                phone:
                  activation.phone.trim(),
              }),
            },
          );

        const payload =
          (await response.json()) as
            | ActivationLookupResponse
            | ApiErrorResponse;

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              payload as ApiErrorResponse,
            ),
          );
        }

        const result =
          payload as ActivationLookupResponse;

        if (!result.exists) {
          setActivationError(
            "No matching KUHRSA membership record was found.",
          );
          return false;
        }

        if (
          result.code ===
          "ALREADY_ACTIVE"
        ) {
          setActivationError(
            "Your KUHRSA account is already active. Please use the Login option.",
          );
          return false;
        }

        if (!result.eligible) {
          setActivationError(
            result.message ||
              "This KUHRSA membership is not currently eligible for activation.",
          );
          return false;
        }

        if (
          !result.activationToken
        ) {
          setActivationError(
            "The KUHRSA activation request could not be initialized. Please try again.",
          );
          return false;
        }

        setActivationRecord(
          result,
        );

        setActivationToken(
          result.activationToken,
        );

        updateActivation(
          "registrationNumber",
          result.member
            .registrationNumber ??
            "",
        );

        updateActivation(
          "membershipNumber",
          result.member.memberNumber,
        );

        updateActivation(
          "admissionNumber",
          result.member
            .admissionNumber ??
            "",
        );

        return true;
      } catch (error) {
        setActivationError(
          error instanceof Error
            ? error.message
            : "KUHRSA membership lookup could not be completed.",
        );

        return false;
      } finally {
        setActivationLoading(
          false,
        );
      }
    };

  const verifyActivationDetails =
    async () => {
      const error =
        validateActivationStep(2);

      if (error) {
        setActivationError(
          error,
        );
        return false;
      }

      if (!activationToken) {
        setActivationError(
          "Your activation session is no longer valid. Please return to Step 1 and identify your membership again.",
        );
        return false;
      }

      setActivationLoading(true);
      setActivationError("");

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/membership-activation/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                token:
                  activationToken,

                memberNumber:
                  activationRecord
                    ?.member
                    .memberNumber ??
                  activation.membershipNumber,

                firstName:
                  activation.firstName.trim(),

                lastName:
                  activation.lastName.trim(),

                email:
                  activation.email
                    .trim()
                    .toLowerCase(),
              }),
            },
          );

        const payload =
          (await response.json()) as
            | ActivationVerificationResponse
            | ApiErrorResponse;

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              payload as ApiErrorResponse,
            ),
          );
        }

        const result =
          payload as ActivationVerificationResponse;

        if (
          result.code ===
          "ALREADY_ACTIVE"
        ) {
          setActivationError(
            "Your KUHRSA account is already active. Please use the Login option.",
          );
          return false;
        }

        if (!result.verified) {
          setActivationError(
            result.message ||
              "Membership verification failed.",
          );
          return false;
        }

        setPaymentRequired(
          result.payment.required,
        );

        setPaymentStepCompleted(
          !result.payment.required,
        );

        return true;
      } catch (error) {
        setActivationError(
          error instanceof Error
            ? error.message
            : "Membership verification could not be completed.",
        );

        return false;
      } finally {
        setActivationLoading(
          false,
        );
      }
    };

  const activateMembership =
    async () => {
      const error =
        validateActivationStep(4);

      if (error) {
        setActivationError(
          error,
        );
        return false;
      }

      if (!activationToken) {
        setActivationError(
          "Your activation session is no longer valid. Please return to Step 1 and identify your membership again.",
        );
        return false;
      }

      if (!activationRecord) {
        setActivationError(
          "Your KUHRSA membership record could not be found in this activation session.",
        );
        return false;
      }

      setActivationLoading(true);
      setActivationError("");

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/membership-activation`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                token:
                  activationToken,
                password:
                  activation.password,
              }),
            },
          );

        const payload =
          (await response.json()) as
            | ActivationResponse
            | ApiErrorResponse;

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              payload as ApiErrorResponse,
            ),
          );
        }

        const result =
          payload as ActivationResponse;

        setActivationResult(
          result,
        );

        return true;
      } catch (error) {
        setActivationError(
          error instanceof Error
            ? error.message
            : "Your KUHRSA account could not be activated.",
        );

        return false;
      } finally {
        setActivationLoading(
          false,
        );
      }
    };

  const nextActivationStep =
    async () => {
      const error =
        validateActivationStep(
          activationStep,
        );

      if (error) {
        setActivationError(
          error,
        );
        return;
      }

      setActivationError("");

      if (
        activationStep === 1
      ) {
        const lookedUp =
          await lookupMembership();

        if (!lookedUp) {
          return;
        }

        setActivationStep(2);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      if (
        activationStep === 2
      ) {
        const verified =
          await verifyActivationDetails();

        if (!verified) {
          return;
        }

        setActivationStep(
          paymentRequired ? 3 : 4,
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      if (
        activationStep === 3
      ) {
        if (paymentRequired) {
          setPaymentStepCompleted(true);
        }

        setActivationStep(4);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      if (
        activationStep === 4
      ) {
        const activated =
          await activateMembership();

        if (!activated) {
          return;
        }

        setActivationStep(5);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      if (
        activationStep === 5
      ) {
        completeActivation();
        return;
      }
    };

  const previousActivationStep =
    () => {
      setActivationError("");

      if (
        activationStep > 1
      ) {
        setActivationStep(
          (current) => {
            if (
              current === 4 &&
              !paymentRequired
            ) {
              return 2;
            }

            return (
              current - 1
            ) as ActivationStep;
          },
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

  const completeActivation = () => {
    if (!activationResult) {
      setActivationError(
        "Your activation has not completed yet. Please finish the activation steps.",
      );
      return;
    }

    setActivationStep(5);
  };

  const fullName =
    useMemo(
      () =>
        [
          activation.firstName,
          activation.lastName,
        ]
          .filter(Boolean)
          .join(" "),
      [
        activation.firstName,
        activation.lastName,
      ],
    );


  return (
    <main className="min-h-screen bg-[#F4FAFC] px-5 py-12 sm:py-16">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-black/5 lg:grid-cols-[0.85fr_1.15fr]">
          <section
            className={`relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between ${
              mode === "login"
                ? "bg-[#2BB9EC]"
                : "bg-[#F700BA]"
            }`}
          >
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

                  <div
                    className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                      mode === "login"
                        ? "text-[#0B2633]"
                        : "text-white/80"
                    }`}
                  >
                    Student Association
                  </div>
                </div>
              </Link>

              <div className="mt-16 max-w-sm">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  {mode === "login"
                    ? "Member Portal"
                    : "Membership Activation"}
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight">
                  {mode === "login"
                    ? "Your KUHRSA access point."
                    : "Activate your KUHRSA membership."}
                </h2>

                <p className="mt-5 leading-7 text-white/80">
                  {mode === "login"
                    ? "Sign in using your email address or registration number to access your KUHRSA member account."
                    : "Verify your existing KUHRSA membership record, create your account and complete any membership payment required before activation."}
                </p>
              </div>
            </div>

            <p className="text-sm text-white/60">
              Connecting students, leaders and opportunities.
            </p>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
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

                  <div
                    className={`text-[9px] font-bold uppercase tracking-[0.15em] ${
                      mode === "login"
                        ? "text-[#168DB8]"
                        : "text-[#CE26A4]"
                    }`}
                  >
                    Student Association
                  </div>
                </div>
              </Link>
            </div>

            <div className="mx-auto max-w-md">
              <p
                className={`text-sm font-black uppercase tracking-[0.2em] ${
                  mode === "login"
                    ? "text-[#168DB8]"
                    : "text-[#CE26A4]"
                }`}
              >
                Member Access
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0B2633]">
                {mode === "login"
                  ? "Welcome back."
                  : activationStep === 5
                    ? "Activation complete."
                    : "Activate your membership."}
              </h1>

              <p className="mt-4 leading-7 text-black/60">
                {mode === "login"
                  ? "Sign in to access your KUHRSA member account."
                  : activationStep === 5
                    ? "Your KUHRSA membership activation process has been completed."
                    : "Use your existing KUHRSA membership details to activate access to the new Member Portal."}
              </p>

              <div className="mt-8 grid grid-cols-2 rounded-full bg-[#F4FAFC] p-1">
                <button
                  type="button"
                  onClick={() =>
                    changeMode("login")
                  }
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    mode === "login"
                      ? "bg-[#168DB8] text-white shadow-sm"
                      : "text-black/55 hover:text-[#168DB8]"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() =>
                    changeMode("activate")
                  }
                  className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                    mode === "activate"
                      ? "bg-[#F700BA] text-white shadow-sm"
                      : "text-black/55 hover:text-[#CE26A4]"
                  }`}
                >
                  Activate
                </button>
              </div>

              {mode === "login" && (
                <>
                  <form
                    className="mt-8 grid gap-5"
                    onSubmit={
                      handleMemberLogin
                    }
                  >
                    <div>
                      <label
                        htmlFor="login-identifier"
                        className="text-sm font-bold text-[#0B2633]"
                      >
                        Email or Registration Number
                      </label>

                      <input
                        id="login-identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        placeholder="Email or registration number"
                        value={
                          loginIdentifier
                        }
                        onChange={(
                          event,
                        ) =>
                          setLoginIdentifier(
                            event.target
                              .value,
                          )
                        }
                        disabled={
                          loginLoading
                        }
                        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-black/35 focus:border-[#168DB8] focus:ring-2 focus:ring-[#168DB8]/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="login-password"
                        className="text-sm font-bold text-[#0B2633]"
                      >
                        Password
                      </label>

                      <input
                        id="login-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={
                          loginPassword
                        }
                        onChange={(
                          event,
                        ) =>
                          setLoginPassword(
                            event.target
                              .value,
                          )
                        }
                        disabled={
                          loginLoading
                        }
                        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-black/35 focus:border-[#168DB8] focus:ring-2 focus:ring-[#168DB8]/15"
                      />
                    </div>

                    {loginError && (
                      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 ring-1 ring-red-100">
                        {loginError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        loginLoading
                      }
                      className="mt-1 rounded-full bg-[#168DB8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#11799D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loginLoading
                        ? "Signing In..."
                        : "Sign In"}
                    </button>
                  </form>

                  <div className="mt-8 border-t border-black/10 pt-6 text-center">
                    <p className="text-sm text-black/55">
                      Not registered yet?
                    </p>

                    <Link
                      href="/register"
                      className="mt-2 inline-block font-bold text-[#168DB8] transition hover:text-[#11799D]"
                    >
                      Register for KUHRSA →
                    </Link>
                  </div>

                  <div className="mt-5 text-center">
                    <Link
                      href="/"
                      className="text-sm font-semibold text-black/40 transition hover:text-[#168DB8]"
                    >
                      ← Back to KUHRSA
                    </Link>
                  </div>
                </>
              )}

              {mode === "activate" && (
                <>
                  {activationStep < 5 && (
                    <div className="mt-7">
                      <div className="flex items-center gap-2">
                        {activationSteps.map(
                          (item) => (
                            <div
                              key={
                                item.number
                              }
                              className={`h-1.5 flex-1 rounded-full ${
                                item.number <=
                                activationStep
                                  ? "bg-[#F700BA]"
                                  : "bg-black/10"
                              }`}
                            />
                          ),
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-black/40">
                        <span>
                          Step{" "}
                          {
                            activationStep
                          }{" "}
                          of 4
                        </span>

                        <span>
                          {
                            activationSteps[
                              activationStep -
                                1
                            ]?.label
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {activationStep ===
                    1 && (
                    <div className="mt-8">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CE26A4]">
                        Step 1
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                        Identify your membership.
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-black/55">
                        Enter the registration or membership number,
                        together with the email address and phone number
                        already associated with your KUHRSA membership.
                      </p>

                      <div className="mt-6 grid gap-5">
                        <Field
                          label="Registration or Membership Number"
                          value={
                            activation.identifier
                          }
                          onChange={(value) =>
                            updateActivation(
                              "identifier",
                              value,
                            )
                          }
                          placeholder="Registration or membership number"
                        />

                        <Field
                          label="Email Address"
                          type="email"
                          value={
                            activation.email
                          }
                          onChange={(value) =>
                            updateActivation(
                              "email",
                              value,
                            )
                          }
                          placeholder="Registered email address"
                        />

                        <Field
                          label="Phone Number"
                          type="tel"
                          value={
                            activation.phone
                          }
                          onChange={(value) =>
                            updateActivation(
                              "phone",
                              value,
                            )
                          }
                          placeholder="Registered phone number"
                        />
                      </div>
                    </div>
                  )}

                  {activationStep ===
                    2 && (
                    <div className="mt-8">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CE26A4]">
                        Step 2
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                        Verify your details.
                      </h2>

                      {activationRecord && (
                        <div className="mt-6 rounded-2xl bg-[#F9F4FC] p-5">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CE26A4]">
                            Membership Record Found
                          </p>

                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <InfoItem
                              label="Member Number"
                              value={
                                activationRecord
                                  .member
                                  .memberNumber
                              }
                            />

                            <InfoItem
                              label="Category"
                              value={
                                activationRecord
                                  .member
                                  .category
                              }
                            />

                            <InfoItem
                              label="Identifier"
                              value={
                                activation.identifier
                              }
                            />

                            <InfoItem
                              label="Status"
                              value="Eligible for activation"
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <Field
                          label="First Name"
                          value={
                            activation.firstName
                          }
                          onChange={(value) =>
                            updateActivation(
                              "firstName",
                              value,
                            )
                          }
                          placeholder="First name"
                        />

                        <Field
                          label="Last Name"
                          value={
                            activation.lastName
                          }
                          onChange={(value) =>
                            updateActivation(
                              "lastName",
                              value,
                            )
                          }
                          placeholder="Last name"
                        />

                        <Field
                          label="Admission Number"
                          value={
                            activation.admissionNumber
                          }
                          onChange={(value) =>
                            updateActivation(
                              "admissionNumber",
                              value,
                            )
                          }
                          placeholder={
                            activationRecord
                              ?.member
                              .admissionNumber ??
                            "Admission number, if applicable"
                          }
                        />
                      </div>

                      <div className="mt-6 rounded-2xl border border-[#CE26A4]/10 bg-[#F9F4FC] p-4">
                        <p className="text-sm leading-6 text-black/55">
                          KUHRSA has already found your membership record.
                          The details entered here will now be matched against
                          the record before account creation is allowed.
                        </p>
                      </div>
                    </div>
                  )}

                  {activationStep ===
                    3 && (
                    <div className="mt-8">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CE26A4]">
                        Step 3
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                        Complete payment.
                      </h2>

                      {paymentRequired ? (
                        <>
                          <p className="mt-3 text-sm leading-6 text-black/55">
                            Your membership record requires the applicable
                            registration payment before account activation
                            can be completed.
                          </p>

                          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                              Payment setup
                            </p>

                            <p className="mt-2 text-sm leading-6 text-amber-900/70">
                              Payment processing is currently being connected
                              to the KUHRSA Finance and M-Pesa service.
                              This screen records the payment method for the
                              activation flow but does not confirm a real
                              transaction yet.
                            </p>
                          </div>

                          <div className="mt-6 grid gap-5">
                            <div>
                              <label className="mb-2 block text-sm font-bold text-[#0B2633]">
                                Payment Method
                              </label>

                              <select
                                value={
                                  activation.paymentMethod
                                }
                                onChange={(event) =>
                                  updateActivation(
                                    "paymentMethod",
                                    event.target.value,
                                  )
                                }
                                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#0B2633] outline-none transition focus:border-[#F700BA]"
                              >
                                <option value="">
                                  Select payment method
                                </option>
                                <option value="M-Pesa">
                                  M-Pesa
                                </option>
                                <option value="Manual">
                                  Manual Payment
                                </option>
                              </select>
                            </div>

                            {activation.paymentMethod ===
                              "M-Pesa" && (
                              <Field
                                label="M-Pesa Number"
                                type="tel"
                                value={
                                  activation.mpesaNumber
                                }
                                onChange={(value) =>
                                  updateActivation(
                                    "mpesaNumber",
                                    value,
                                  )
                                }
                                placeholder="e.g. 07XXXXXXXX"
                              />
                            )}
                          </div>

                          <div className="mt-7 rounded-2xl bg-[#F9F4FC] p-4">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CE26A4]">
                              Development Status
                            </p>

                            <p className="mt-2 text-sm leading-6 text-black/55">
                              Selecting the payment details allows you to
                              continue through the development activation
                              flow. A successful M-Pesa transaction will be
                              enforced when the Finance integration is
                              connected.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="mt-6 rounded-2xl bg-[#F9F4FC] p-5">
                          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CE26A4]">
                            Payment Not Required
                          </p>

                          <p className="mt-2 text-sm leading-6 text-black/55">
                            Your membership record does not require an
                            initial registration payment. You may continue
                            directly to account creation.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activationStep ===
                    4 && (
                    <div className="mt-8">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#CE26A4]">
                        Step 4
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                        Create your account.
                      </h2>

                      <p className="mt-3 text-sm leading-6 text-black/55">
                        Your membership details have been verified.
                        Create the password you will use to access
                        the KUHRSA Member Portal.
                      </p>

                      <div className="mt-6 grid gap-5">
                        <Field
                          label="Email Address"
                          type="email"
                          value={
                            activation.email
                          }
                          onChange={(value) =>
                            updateActivation(
                              "email",
                              value,
                            )
                          }
                          placeholder="Your registered email"
                        />

                        <Field
                          label="Create Password"
                          type="password"
                          value={
                            activation.password
                          }
                          onChange={(value) =>
                            updateActivation(
                              "password",
                              value,
                            )
                          }
                          placeholder="At least 8 characters"
                        />

                        <Field
                          label="Confirm Password"
                          type="password"
                          value={
                            activation.confirmPassword
                          }
                          onChange={(value) =>
                            updateActivation(
                              "confirmPassword",
                              value,
                            )
                          }
                          placeholder="Confirm your password"
                        />
                      </div>

                      <label className="mt-7 flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={
                            activation.acceptTerms
                          }
                          onChange={(
                            event,
                          ) =>
                            updateActivation(
                              "acceptTerms",
                              event.target.checked,
                            )
                          }
                          className="mt-1 h-4 w-4 rounded border-black/20 accent-[#F700BA]"
                        />

                        <span className="text-sm leading-6 text-black/60">
                          I confirm that the information provided is accurate
                          and agree to the KUHRSA terms, privacy statement and
                          membership rules.
                        </span>
                      </label>

                      <div className="mt-7 rounded-2xl bg-[#F9F4FC] p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#CE26A4]">
                          Membership Activation
                        </p>

                        <p className="mt-2 text-sm leading-6 text-black/55">
                          Your account will be activated through the secure
                          KUHRSA membership activation service after you
                          submit your account details.
                        </p>
                      </div>
                    </div>
                  )}

                  {activationStep ===
                    5 && (
                    <div className="mt-8">
                      <div className="rounded-3xl bg-[#F9F4FC] p-7 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F700BA] text-2xl font-black text-white">
                          ✓
                        </div>

                        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[#CE26A4]">
                          Membership Activated
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-[#0B2633]">
                          {fullName
                            ? `Welcome, ${fullName}.`
                            : "Welcome to KUHRSA."}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-black/55">
                          Your KUHRSA account has been activated successfully.
                        </p>

                        {activationResult?.member
                          ?.memberNumber && (
                          <div className="mt-5 rounded-2xl bg-white p-4 text-left ring-1 ring-black/5">
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/35">
                              KUHRSA Member Number
                            </p>

                            <p className="mt-1 text-lg font-black text-[#0B2633]">
                              {
                                activationResult
                                  .member
                                  .memberNumber
                              }
                            </p>
                          </div>
                        )}

                        <Link
                          href="/dashboard"
                          className="mt-7 inline-flex rounded-full bg-[#F700BA] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#CE26A4]"
                        >
                          Continue to Member Portal
                        </Link>
                      </div>
                    </div>
                  )}

                  {activationError && (
                    <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 ring-1 ring-red-100">
                      {activationError}
                    </div>
                  )}

                  {activationStep < 5 && (
                    <div className="mt-8 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={
                          previousActivationStep
                        }
                        disabled={
                          activationStep ===
                            1 ||
                          activationLoading
                        }
                        className="rounded-full border border-black/10 px-5 py-3 text-sm font-bold text-[#0B2633] transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextActivationStep
                        }
                        disabled={
                          activationLoading
                        }
                        className="rounded-full bg-[#F700BA] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#CE26A4] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activationLoading
                          ? activationStep ===
                            1
                            ? "Checking Membership..."
                            : activationStep ===
                                2
                              ? "Verifying..."
                              : activationStep ===
                                  3
                                ? "Processing Payment..."
                                : activationStep ===
                                    4
                                  ? "Creating Account..."
                                  : "Processing..."
                          : activationStep ===
                              3
                            ? "Continue to Account"
                            : activationStep ===
                                4
                              ? "Create Account"
                              : "Continue"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[#0B2633]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-black/35 focus:border-[#CE26A4] focus:ring-2 focus:ring-[#CE26A4]/15"
      />
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-black/35">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#0B2633]">
        {value}
      </p>
    </div>
  );
}