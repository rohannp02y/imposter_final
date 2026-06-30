"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  GamepadIcon,
  TrophyIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
} from "@/components/icons/SvgIcons";
import { playSound } from "@/lib/sounds";

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-purple-500 rounded-xl flex items-center justify-center">
              <GamepadIcon size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">
              IMPOSTER
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/game/lobby"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <GamepadIcon size={16} />
              Play
            </Link>
            <Link
              href="/leaderboard"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <TrophyIcon size={16} />
              Leaderboard
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-purple-500 flex items-center justify-center text-sm font-bold">
                    {(session.user as { username?: string })?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm">
                    {(session.user as { username?: string })?.username || "User"}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => {
              playSound("button_click");
              setMobileMenuOpen(!mobileMenuOpen);
            }}
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border animate-slide-up">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/game/lobby"
              className="block py-2 text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Play
            </Link>
            <Link
              href="/leaderboard"
              className="block py-2 text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-white/70 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/");
                  }}
                  className="block py-2 text-white/70 hover:text-white w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2 text-white/70 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-2 text-accent-primary hover:text-accent-primary-hover"
                  onClick={() => setMobileMenuOpen(false)}
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
