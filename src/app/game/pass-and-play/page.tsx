"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PassAndPlayPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/game/pass-and-play/setup");
  }, [router]);
  return null;
}
