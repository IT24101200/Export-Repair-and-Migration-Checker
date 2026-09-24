"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, ShieldAlert, LogOut, Trash2, Check, ArrowLeft } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Alex Developer");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSignOut = () => {
    alert("Signed out successfully.");
    router.push("/login");
  };

  const handleDeleteAccount = () => {
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm account deletion.");
      return;
    }
    alert("Account and all saved summary records have been deleted.");
    router.push("/");
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
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your account profile and authentication preferences.
        </p>
      </div>

      {/* Account Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Profile Details
        </h2>

        {/* Email read-only */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              disabled
              value="alex.developer@example.com"
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 rounded-lg cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Authentication is passwordless via one-time email codes.
          </p>
        </div>

        {/* Display name form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-xs font-semibold text-slate-700 mb-1">
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
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Saved separately from scan summaries. Max 60 characters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors"
            >
              Save Profile
            </button>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium">
                <Check className="w-3.5 h-3.5" />
                Profile updated!
              </span>
            )}
          </div>
        </form>

        {/* Stored data explanation */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-600">
          <strong className="text-slate-800 font-semibold block">What we store for your account:</strong>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
            <li>Your authenticated email and optional display name.</li>
            <li>High-level summary counts from scans you explicitly choose to save.</li>
            <li>We do not store your export archives, note contents, or files.</li>
          </ul>
        </div>

        {/* Sign out */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600">Finished your session?</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-red-900">Delete Account &amp; Stored Summaries</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Permanently delete your profile and all associated saved scan summary records from our database. This action cannot be undone.
            </p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-base">
              <Trash2 className="w-5 h-5" />
              <h3>Confirm Account Deletion</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete your account and all saved audit summaries. Type <strong className="text-slate-900 font-mono">DELETE</strong> below to confirm:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmText !== "DELETE"}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-semibold transition-colors"
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
