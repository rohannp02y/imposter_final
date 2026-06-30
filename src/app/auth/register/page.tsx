"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, GamepadIcon, LoaderIcon } from "@/components/icons/SvgIcons";
import { playSound } from "@/lib/sounds";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    playSound("button_click");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Minimum 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }

      localStorage.setItem("imposter_user", JSON.stringify({ id: data.user.id, username: data.user.username }));
      playSound("player_join");
      router.push("/game/lobby");
      router.refresh();
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
          <div className="w-12 h-12 bg-crimson/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <GamepadIcon size={20} className="text-crimson" />
          </div>
          <h1 className="text-display text-3xl text-ink-primary mb-2">Join the game</h1>
          <p className="text-ink-muted text-sm font-mono">Create your identity</p>
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
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Choose a name"
                required
                minLength={2}
                maxLength={20}
              />
            </div>

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
                  minLength={6}
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

            <div>
              <label className="block text-ink-muted text-xs font-mono uppercase tracking-wider mb-2">
                Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <LoaderIcon size={16} />}
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ink-muted text-xs font-mono">
              Already have one?{" "}
              <Link href="/auth/login" className="text-crimson hover:text-crimson-glow transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
