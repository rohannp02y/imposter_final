"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon } from "@/components/icons/SvgIcons";
import { Logo } from "@/components/icons/Logo";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-hairline">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={32} />
            <span className="text-display text-sm font-medium tracking-ultra-tight text-ink-primary hidden sm:block">
              IMPOSTER
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
            ) : session ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 text-ink-secondary hover:text-ink-primary transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-crimson/20 flex items-center justify-center text-xs font-medium text-crimson">
                  {(session.user as { username?: string })?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-xs font-mono">
                  {(session.user as { username?: string })?.username || "User"}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-xs py-2 px-4 font-mono uppercase tracking-wider">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-ink-muted hover:text-ink-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-hairline">
          <div className="px-6 py-4 space-y-3">
            {session ? (
              <Link
                href="/profile"
                className="block py-2 text-ink-muted hover:text-ink-primary text-sm font-mono uppercase tracking-wider"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2 text-ink-muted hover:text-ink-primary text-sm font-mono uppercase tracking-wider"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-2 text-crimson text-sm font-mono uppercase tracking-wider"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
