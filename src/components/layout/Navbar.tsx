"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon, GamepadIcon, TagsIcon } from "@/components/icons/SvgIcons";
import { Logo } from "@/components/icons/Logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // The admin panel has its own header.
  if (pathname.startsWith("/admin")) return null;

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
            <Link
              href="/custom"
              className="flex items-center gap-2 text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <TagsIcon size={14} />
              Custom Words
            </Link>
            <Link
              href="/game/pass-and-play/setup"
              className="btn-primary flex items-center gap-2 text-xs py-2 px-4 font-mono uppercase tracking-wider"
            >
              <GamepadIcon size={14} />
              Play
            </Link>
          </div>

          <button
            className="md:hidden text-ink-secondary hover:text-ink-primary transition-colors p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-hairline">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="/game/pass-and-play/setup"
              className="flex items-center gap-3 py-2 text-crimson text-sm font-mono uppercase tracking-wider"
              onClick={() => setMobileOpen(false)}
            >
              <GamepadIcon size={16} />
              Play
            </Link>
            <Link
              href="/custom"
              className="flex items-center gap-3 py-2 text-ink-secondary hover:text-ink-primary text-sm font-mono uppercase tracking-wider"
              onClick={() => setMobileOpen(false)}
            >
              <TagsIcon size={16} />
              Custom Words
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
