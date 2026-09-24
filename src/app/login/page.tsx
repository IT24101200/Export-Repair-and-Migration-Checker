"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send email verification code
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("code");
    }, 800);
  };

  // Verify entered code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 800);
  };

  return (
    <div className="container-public py-16 max-w-md my-auto space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
            <KeyRound className="w-5 h-5 text-indigo-600" />
            <h1>Sign In with Email Code</h1>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Save summary counts to your account. Your export files are never uploaded or saved.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                We will email you a 6-digit one-time sign-in code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-xs shadow-sm transition-colors"
            >
              {loading ? "Sending code..." : "Send Verification Code"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Step 2: Code Form */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Code sent to <span className="font-semibold text-slate-900">{email}</span>.{" "}
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-indigo-600 underline font-medium"
              >
                Change
              </button>
            </div>

            <div>
              <label htmlFor="code" className="block text-xs font-semibold text-slate-700 mb-1">
                6-Digit Verification Code
              </label>
              <input
                id="code"
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                className="w-full text-center tracking-widest font-mono text-lg py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Demo code: Enter any 6 digits (e.g. <code>123456</code>).
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-xs shadow-sm transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setError(null);
                alert("A new test code has been sent!");
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-indigo-600"
            >
              Did not receive code? Resend
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-slate-900 text-base">Signed In Successfully</h2>
              <p className="text-xs text-slate-600">
                You are authenticated as <span className="font-medium text-slate-800">{email}</span>.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="block py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium text-xs text-center"
              >
                Go to My Reports
              </Link>
              <Link
                href="/check"
                className="block py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs text-center"
              >
                Return to Workspace
              </Link>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Sign-in is optional. You never need an account to scan or fix notes.</span>
        </div>
      </div>
    </div>
  );
}
