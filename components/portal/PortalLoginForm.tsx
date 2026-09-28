"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  canAccessPortal,
  getLandingPath,
  login,
  PortalType,
} from "@/lib/auth";

type PortalLoginFormProps = {
  emailId: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  accent?: "blue" | "pink";
  portal: PortalType;
};

export default function PortalLoginForm({
  emailId,
  emailLabel = "Email Address",
  emailPlaceholder = "Enter your email address",
  buttonLabel = "Sign In",
  accent = "blue",
  portal,
}: PortalLoginFormProps) {
  const router = useRouter();
  const isPink = accent === "pink";

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError(
        "Enter your email address and password.",
      );
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        email,
        password,
      );

      if (
        !canAccessPortal(
          result.user,
          portal,
        )
      ) {
        throw new Error(
          `Your account does not have access to the ${portal} portal.`,
        );
      }

      router.replace(
        getLandingPath(result.user),
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="mt-8 grid gap-5"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor={emailId}
          className="text-sm font-bold text-[#0B2633]"
        >
          {emailLabel}
        </label>

        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder={emailPlaceholder}
          disabled={loading}
          className={`mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-black/35 ${
            isPink
              ? "focus:border-[#F700BA] focus:ring-2 focus:ring-[#F700BA]/15"
              : "focus:border-[#168DB8] focus:ring-2 focus:ring-[#168DB8]/15"
          }`}
        />
      </div>

      <div>
        <label
          htmlFor={`${emailId}-password`}
          className="text-sm font-bold text-[#0B2633]"
        >
          Password
        </label>

        <input
          id={`${emailId}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Enter your password"
          disabled={loading}
          className={`mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-black/35 ${
            isPink
              ? "focus:border-[#F700BA] focus:ring-2 focus:ring-[#F700BA]/15"
              : "focus:border-[#168DB8] focus:ring-2 focus:ring-[#168DB8]/15"
          }`}
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`mt-1 rounded-full px-5 py-3.5 text-sm font-bold text-white transition ${
          isPink
            ? "bg-[#F700BA] hover:bg-[#CE26A4]"
            : "bg-[#168DB8] hover:bg-[#11799D]"
        } ${
          loading
            ? "cursor-not-allowed opacity-60"
            : ""
        }`}
      >
        {loading
          ? "Signing In..."
          : buttonLabel}
      </button>
    </form>
  );
}
