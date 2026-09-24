"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";

// Header component for navigation across public pages
export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container-public flex items-center justify-between h-16">
        {/* Product logo and title */}
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg hover:text-indigo-600">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <span>Export Repair</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/check" className="hover:text-indigo-600 transition-colors">
            Check an export
          </Link>
          <Link href="/guides" className="hover:text-indigo-600 transition-colors">
            Guides
          </Link>
          <Link href="/help" className="hover:text-indigo-600 transition-colors">
            Help
          </Link>
          <Link href="/login" className="hover:text-indigo-600 transition-colors">
            Sign in
          </Link>
          <Link
            href="/check"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors"
          >
            Start Check
            <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/check"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-indigo-600"
          >
            Check an export
          </Link>
          <Link
            href="/guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-indigo-600"
          >
            Guides
          </Link>
          <Link
            href="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-indigo-600"
          >
            Help
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium hover:text-indigo-600"
          >
            Sign in
          </Link>
          <Link
            href="/check"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-sm"
          >
            Start Check
          </Link>
        </div>
      )}
    </header>
  );
}
