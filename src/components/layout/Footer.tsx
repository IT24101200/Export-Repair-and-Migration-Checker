import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// Standard footer component with navigation and disclaimer
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="container-public">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand and product brief */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Export Repair and Migration Checker</span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Check your Notion Markdown and CSV exports, review broken internal links, approve safe target repairs, and download a clean copy. All files stay on your device.
            </p>
            <p className="text-xs text-slate-500 pt-2">
              An independent open-source tool. Not affiliated with, sponsored by, or endorsed by Notion Labs, Inc. or Obsidian.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/check" className="hover:text-indigo-600">
                  Check an export
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-600">
                  My Reports
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/guides" className="hover:text-indigo-600">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-indigo-600">
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Export Repair and Migration Checker.</span>
          <span>Your archive is processed securely on this device.</span>
        </div>
      </div>
    </footer>
  );
}
