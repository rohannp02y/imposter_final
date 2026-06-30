"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LobbyPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
