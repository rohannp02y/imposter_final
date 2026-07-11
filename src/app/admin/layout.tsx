"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdminUser } from "@/lib/firestore";
import { Logo } from "@/components/icons/Logo";
import {
  LockIcon, UserIcon, LogOutIcon, LayoutIcon, TagsIcon, AlertIcon, LoaderIcon,
} from "@/components/icons/SvgIcons";

// Usernames map to synthetic emails in Firebase Auth.
const USERNAME_DOMAIN = "nepaliimposter.app";

type AuthState = "loading" | "signed-out" | "authorized";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setAuthState("signed-out");
        return;
      }
      const ok = await isAdminUser(user.uid);
      if (ok) {
        setAuthState("authorized");
      } else {
        await signOut(auth);
        setAuthState("signed-out");
        setError("This account has no admin access.");
      }
    });
    return unsub;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const email = `${username.trim().toLowerCase()}@${USERNAME_DOMAIN}`;
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged completes the flow.
    } catch {
      setError("Wrong username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon size={28} className="text-crimson" />
      </div>
    );
  }

  if (authState === "signed-out") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 gradient-mesh opacity-20 pointer-events-none" />
        <div className="w-full max-w-sm relative z-10">
          <div className="card-surface p-8">
            <div className="flex flex-col items-center mb-8">
              <Logo size={48} />
              <h1 className="text-display text-2xl text-ink-primary mt-4">Admin Access</h1>
              <p className="text-ink-muted text-xs font-mono uppercase tracking-widest mt-1">
                Restricted area
              </p>
            </div>

            {error && (
              <div className="bg-crimson/10 border border-crimson/30 text-crimson-glow px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                <AlertIcon size={15} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-11"
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="relative">
                <LockIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !username || !password}
                className="btn-primary w-full py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <LoaderIcon size={16} /> : <LockIcon size={15} />}
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutIcon },
    { href: "/admin/words", label: "Words", icon: TagsIcon },
  ];

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <span className="text-display text-sm text-ink-primary tracking-ultra-tight">
              IMPOSTER <span className="text-crimson">ADMIN</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    active
                      ? "bg-crimson/15 text-crimson border border-crimson/30"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-white/5"
                  }`}
                >
                  <item.icon size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-ink-secondary hover:text-crimson transition-colors"
              title="Sign out"
            >
              <LogOutIcon size={14} />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
