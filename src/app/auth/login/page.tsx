"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, LoaderIcon } from "@/components/icons/SvgIcons";
import { Logo } from "@/components/icons/Logo";
import { playSound } from "@/lib/sounds";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    playSound("button_click");
    setLoading(true);

    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid credentials");
      } else {
        playSound("player_join");
        router.push("/game/lobby");
        router.refresh();
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo size={48} />
          </div>
          <h1 className="text-display text-3xl text-ink-primary mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm font-mono">Enter the game</p>
        </div>

        <div className="card-surface p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-crimson/10 border border-crimson/20 text-crimson px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <LoaderIcon size={16} />}
              {loading ? "Entering..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ink-muted text-xs font-mono">
              No account?{" "}
              <Link href="/auth/register" className="text-crimson hover:text-crimson-glow transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
