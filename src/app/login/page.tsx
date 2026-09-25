"use client";

import { useState, ChangeEvent, FormEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Database,
  FileText,
  KeyRound,
  Sparkles,
} from "lucide-react";
import {
  Ripple,
  AuthTabs,
  TechOrbitDisplay,
  BoxReveal,
} from "@/components/ui/modern-animated-sign-in";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

// Tech and Tool icons orbiting the central badge
const iconsArray: OrbitIcon[] = [
  {
    component: () => (
      <Image
        width={30}
        height={30}
        src="https://cdn.21st.dev/assets/mirror/34/34826e5b3315daadf4fa15f723a3c1d5ba4a89277bfd94e22ac4d7d3d54338c5.svg"
        alt="HTML5"
      />
    ),
    className: "size-[30px] border-none bg-transparent",
    duration: 20,
    delay: 20,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={30}
        height={30}
        src="https://cdn.21st.dev/assets/mirror/36/36b7d94b657d571d3f94042acbf6a4c86a5301a222f83f4b4583ad2acf6e297d.svg"
        alt="CSS3"
      />
    ),
    className: "size-[30px] border-none bg-transparent",
    duration: 20,
    delay: 10,
    radius: 100,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={40}
        height={40}
        src="https://cdn.21st.dev/assets/mirror/c9/c9191199f4049920c2fc19035b8a6664f37f4689fcd9e8434e786097e78863f0.svg"
        alt="TypeScript"
      />
    ),
    className: "size-[40px] border-none bg-transparent",
    radius: 180,
    duration: 24,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={40}
        height={40}
        src="https://cdn.21st.dev/assets/mirror/06/0656ff65fc8eeacda5c78d7f9ffe91ec1eb919db64f56e0b7dcd460af4bbd36c.svg"
        alt="JavaScript"
      />
    ),
    className: "size-[40px] border-none bg-transparent",
    radius: 180,
    duration: 24,
    delay: 20,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={32}
        height={32}
        src="https://cdn.21st.dev/assets/mirror/f8/f8cec54589553807eb603bcaf4e056aa090196211698b056542e3cc62a2f3448.svg"
        alt="TailwindCSS"
      />
    ),
    className: "size-[32px] border-none bg-transparent",
    duration: 22,
    delay: 15,
    radius: 250,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={32}
        height={32}
        src="https://cdn.21st.dev/assets/mirror/d9/d9435c4ede7133b376c0173a80226bb3856729366707cd96e9a66e39448d0288.svg"
        alt="Nextjs"
      />
    ),
    className: "size-[32px] border-none bg-transparent",
    duration: 22,
    delay: 5,
    radius: 250,
    path: false,
    reverse: true,
  },
  {
    component: () => (
      <Image
        width={40}
        height={40}
        src="https://cdn.21st.dev/assets/mirror/58/5825b649c8c04dec13ecf01d0182401bd0ec71789d2fa06224866d882cd1515f.svg"
        alt="React"
      />
    ),
    className: "size-[40px] border-none bg-transparent",
    radius: 310,
    duration: 28,
    path: false,
    reverse: false,
  },
  {
    component: () => (
      <Image
        width={40}
        height={40}
        src="https://cdn.21st.dev/assets/mirror/71/717a57ea97bf7e86de721dab3e68afac66332a10676d5c9abce4ae6a5a9c9983.svg"
        alt="Git"
      />
    ),
    className: "size-[40px] border-none bg-transparent",
    radius: 310,
    duration: 28,
    delay: 14,
    path: false,
    reverse: false,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [signedIn, setSignedIn] = useState(false);
  const [mode, setMode] = useState<"password" | "code">("password");
  const [notification, setNotification] = useState<string | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: "email" | "password"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email) return;

    // Simulate safe local sign-in
    setSignedIn(true);
    setNotification("Authenticated successfully. Redirecting to reports...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  const handleForgotPassword = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    event.preventDefault();
    if (mode === "password") {
      setMode("code");
      setNotification("Switched to passwordless 6-digit one-time email code mode.");
    } else {
      setMode("password");
      setNotification("Switched back to standard account sign in.");
    }
    setTimeout(() => setNotification(null), 3500);
  };

  const formFields = {
    header: mode === "password" ? "Welcome back" : "One-Time Code",
    subHeader:
      mode === "password"
        ? "Sign in to save your scan audit history"
        : "Enter your email to receive a passwordless sign-in code",
    fields: [
      {
        label: "Email",
        required: true,
        type: "email" as const,
        placeholder: "name@example.com",
        onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, "email"),
      },
      {
        label: mode === "password" ? "Password" : "Verification Code",
        required: true,
        type: (mode === "password" ? "password" : "text") as "password" | "text",
        placeholder: mode === "password" ? "Enter your password" : "Enter 6-digit code (e.g. 123456)",
        onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, "password"),
      },
    ],
    submitButton: mode === "password" ? "Sign in" : "Verify & Sign In",
    textVariantButton:
      mode === "password" ? "Use passwordless email code instead" : "Use standard password instead",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Bar with Navigation and Theme Toggle */}
      <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between z-30 border-b border-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/check"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hidden sm:inline"
          >
            Open Workspace
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Responsive Split Layout */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center relative overflow-hidden">
        {/* Left Side: Orbiting Tech Display + Ripple (Visible on large screens) */}
        <section className="hidden lg:flex flex-col items-center justify-center w-1/2 min-h-[calc(100vh-65px)] relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 border-r border-border">
          <Ripple mainCircleSize={120} numCircles={9} />
          <TechOrbitDisplay
            iconsArray={iconsArray}
            text="Export Repair"
          />

          {/* Reassurance badge below orbit */}
          <div className="absolute bottom-10 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-border text-xs text-slate-600 dark:text-slate-400 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Files are processed 100% locally on your machine</span>
          </div>
        </section>

        {/* Right Side: Animated Sign-In Form (Full-width responsive on mobile) */}
        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-8 py-10 lg:py-16">
          {notification && (
            <div className="w-full max-w-sm mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>{notification}</span>
            </div>
          )}

          {signedIn ? (
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-8 rounded-2xl border border-border shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Signed In Successfully
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as <strong className="text-slate-800 dark:text-slate-200">{formData.email}</strong>. Redirecting you to your saved scan summaries...
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs text-center transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/check"
                  className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs text-center transition-colors"
                >
                  Return to Workspace
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm">
              <AuthTabs
                formFields={formFields}
                goTo={handleForgotPassword}
                handleSubmit={handleSubmit}
              />

              {/* Student Friendly Demo Credentials Hint */}
              <div className="mt-6 pt-4 border-t border-border text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Demo sign-in: Use any valid email address</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Sign in is optional. You never need an account to inspect or repair your exports.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
