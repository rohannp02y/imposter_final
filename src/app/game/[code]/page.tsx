"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoomPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
