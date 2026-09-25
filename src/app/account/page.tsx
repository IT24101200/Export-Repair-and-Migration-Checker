"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldAlert, LogOut, Trash2, Check, ArrowLeft, AlertCircle } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("student.developer@example.com");
  const [displayName, setDisplayName] = useState("Student Developer");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  // Load profile and feedback from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setEmail(data.user.email);
            setDisplayName(data.user.displayName);
          }
        }
      } catch (err) {
        console.error("Failed to load session", err);
      }

      try {
        const resFb = await fetch("/api/feedback");
        if (resFb.ok) {
          const fbData = await resFb.json();
          setFeedbackList(fbData.feedback || []);
        }
      } catch (err) {
        console.error("Failed to load feedback", err);
      }
    }
    loadData();
  }, []);

  const handleDeleteFeedback = async (id: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedbackList((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete feedback entry.");
      }
    } catch {
      alert("Error contacting server.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message || "Failed to update profile.");
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    alert("Signed out successfully.");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm account deletion.");
      return;
    }

    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (res.ok) {
        alert("Account and all saved summary records have been deleted.");
        router.push("/");
      } else {
        alert("Failed to delete account.");
      }
    } catch {
      alert("Error contacting server.");
    }
  };

  return (
    <div className="container-public py-10 max-w-2xl space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to dashboard</span>
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile and authentication preferences.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Account Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Profile Details
        </h2>

        {/* Email read-only */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              disabled
              value={email}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Authentication is passwordless via one-time email codes.
          </p>
        </div>

        {/* Display name form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Display Name (Optional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="displayName"
                type="text"
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Saved separately from scan summaries. Max 60 characters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs transition-colors"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                Profile updated!
              </span>
            )}
          </div>
        </form>

        {/* Stored data explanation */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <strong className="text-slate-800 dark:text-slate-200 font-semibold block">What we store for your account:</strong>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            <li>Your authenticated email and optional display name.</li>
            <li>High-level summary counts from scans you explicitly choose to save.</li>
            <li>We do not store your export archives, note contents, or files.</li>
          </ul>
        </div>

        {/* Sign out */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">Finished your session?</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Submitted Feedback History */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Your Submitted Feedback
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Voluntary structured product feedback you have submitted. You can delete individual responses at any time.
        </p>

        {feedbackList.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No feedback submitted yet. You can submit feedback after inspecting an export.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {feedbackList.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {item.outcome.replace(/_/g, " ")}
                  </span>
                  <span className="text-slate-400 ml-2">
                    Difficulty: <span className="capitalize">{item.reasonCode.replace(/_/g, " ")}</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFeedback(item.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Delete feedback"
                  aria-label="Delete feedback"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/60 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-red-900 dark:text-red-300">Delete Account &amp; Stored Summaries</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Permanently delete your profile and all associated saved scan summary records from our database. This action cannot be undone.
            </p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base">
              <Trash2 className="w-5 h-5" />
              <h3>Confirm Account Deletion</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will permanently delete your account and all saved audit summaries. Type <strong className="text-slate-900 dark:text-slate-100 font-mono">DELETE</strong> below to confirm:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmText !== "DELETE"}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
