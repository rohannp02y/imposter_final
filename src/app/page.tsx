"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { initAudio } from "@/lib/sounds";
import {
  GamepadIcon,
  GlobeIcon,
  ShieldIcon,
  TagsIcon,
  ChevronRightIcon,
  NepalFlagIcon,
} from "@/components/icons/SvgIcons";

const WORDS = [
  "MOMO", "DAL BHAT", "SEL ROTI", "DHARARA", "RAJESH HAMAL",
  "HOSTEL RETURNS", "ANMOL KC", "DHAKA TOPI", "GUNDRI", "CHYADI",
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener("click", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  return (
    <div className="min-h-screen bg-canvas relative">
      {/* Living gradient mesh background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-screen gradient-mesh animate-breathe" />
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-crimson/5 blur-[120px] animate-drift" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[100px] animate-drift" style={{ animationDelay: "-7s" }} />
      </div>

      {/* HERO — asymmetric, editorial */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Main title block */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <NepalFlagIcon size={18} className="text-crimson" />
                <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.2em]">
                  Nepal Edition
                </span>
              </div>

              <h1 className="text-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] mb-8">
                <span className="block text-ink-primary">IMP</span>
                <span className="block text-gradient-crimson">OSTER</span>
              </h1>

              <p className="text-ink-secondary text-lg md:text-xl max-w-md leading-relaxed mb-12 font-light">
                Someone among you is not who they seem.
                <br />
                <span className="text-ink-muted">Find them before it&apos;s too late.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/game/pass-and-play/setup"
                  className="btn-primary group flex items-center justify-center gap-3 text-base"
                >
                  <GamepadIcon size={18} />
                  <span>Begin Session</span>
                  <ChevronRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/game/lobby"
                  className="btn-ghost flex items-center justify-center gap-3 text-base"
                >
                  <GlobeIcon size={18} />
                  <span>Connect Online</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: Floating mystery card */}
          <div className="lg:col-span-5 relative z-10 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 2 }}
              animate={mounted ? { opacity: 1, y: 0, rotate: 1 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="card-glass p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/10 blur-[60px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldIcon size={14} className="text-crimson" />
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">Classified</span>
                  </div>
                  <div className="space-y-4">
                    {["CREW", "CREW", "IMPOSTER", "CREW", "CREW"].map((role, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-hairline/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${role === "IMPOSTER" ? "bg-crimson animate-glow-pulse" : "bg-ink-ghost"}`} />
                          <span className="text-ink-secondary text-sm font-mono">Player {i + 1}</span>
                        </div>
                        <span className={`text-xs font-mono uppercase tracking-wider ${role === "IMPOSTER" ? "text-crimson" : "text-ink-muted"}`}>
                          {role === "IMPOSTER" ? "???" : "Hidden"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-hairline/50">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted text-xs font-mono">Status</span>
                      <span className="text-crimson text-xs font-mono uppercase tracking-wider animate-pulse">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-crimson/50 to-transparent" />
        </motion.div>
      </motion.section>

      {/* WORD SCROLL — floating Nepali words */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-atmosphere" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-6"
          >
            {WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-display text-[clamp(2rem,5vw,4rem)] font-extralight text-ink-ghost/40 hover:text-crimson/60 transition-colors duration-700 cursor-default select-none"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES — broken grid, asymmetric */}
      <section className="relative py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <span className="text-ink-muted text-xs font-mono uppercase tracking-[0.3em] block mb-4">
              Capabilities
            </span>
            <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-ink-primary">
              How it works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {[
              {
                icon: <GamepadIcon size={20} />,
                title: "Gather",
                desc: "3-10 players. One device. Pass it around.",
                span: "md:col-span-5",
                delay: 0,
              },
              {
                icon: <ShieldIcon size={20} />,
                title: "Deceive",
                desc: "One player receives a secret role. The imposter. Their identity is known only to them.",
                span: "md:col-span-7",
                delay: 0.1,
              },
              {
                icon: <TagsIcon size={20} />,
                title: "Discover",
                desc: "Give clues. Ask questions. Vote. Find the imposter before they eliminate the crew.",
                span: "md:col-span-7",
                delay: 0.2,
              },
              {
                icon: <GlobeIcon size={20} />,
                title: "Repeat",
                desc: "422+ Nepali words across 9 categories. Momo. Dal Bhat. Namaste. Every game is different.",
                span: "md:col-span-5",
                delay: 0.3,
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`${feature.span}`}
              >
                <div className="card-surface p-8 h-full group hover:border-crimson/20 transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-crimson/10 flex items-center justify-center text-crimson group-hover:bg-crimson/20 transition-colors">
                      {feature.icon}
                    </div>
                    <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">
                      0{ i + 1 }
                    </span>
                  </div>
                  <h3 className="text-editorial text-2xl text-ink-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-ink-secondary text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — mysterious, minimal */}
      <section className="relative py-40 px-6 md:px-12 lg:px-24">
        <div className="absolute inset-0 gradient-atmosphere opacity-50" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <h2 className="text-display text-[clamp(3rem,8vw,7rem)] leading-[0.85] mb-8">
              <span className="block text-ink-primary">Ready to</span>
              <span className="block text-gradient-crimson">play?</span>
            </h2>
            <p className="text-ink-secondary text-lg max-w-md mx-auto mb-12 font-light">
              The game begins the moment you hand over the phone.
            </p>
            <Link
              href="/game/pass-and-play/setup"
              className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-4"
            >
              <GamepadIcon size={20} />
              Start Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer — minimal */}
      <footer className="relative py-12 px-6 md:px-12 lg:px-24 border-t border-hairline">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <NepalFlagIcon size={14} className="text-crimson" />
            <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">
              Imposter Nepal
            </span>
          </div>
          <div className="flex gap-8">
            <Link href="/admin" className="text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider transition-colors">
              Admin
            </Link>
            <Link href="/leaderboard" className="text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider transition-colors">
              Rankings
            </Link>
            <Link href="/custom" className="text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider transition-colors">
              Custom
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
