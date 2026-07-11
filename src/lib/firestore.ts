import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Category, WordEntry } from "./packs";

// ─── Admin profile ────────────────────────────────────────

export async function isAdminUser(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() && snap.data()?.isAdmin === true;
  } catch {
    return false;
  }
}

// ─── Word pack management (admin) ─────────────────────────

export interface AdminPack {
  id: string;
  name: string;
  emoji?: string;
  categories: Category[];
}

export async function fetchAdminPacks(): Promise<AdminPack[]> {
  const packsSnap = await getDocs(collection(db, "packs"));
  const packs: AdminPack[] = [];
  for (const packDoc of packsSnap.docs) {
    const data = packDoc.data() as { name?: string; emoji?: string };
    const catsSnap = await getDocs(collection(db, "packs", packDoc.id, "categories"));
    const categories = catsSnap.docs
      .map((c) => ({ id: c.id, packId: packDoc.id, ...(c.data() as Omit<Category, "id" | "packId">) }))
      .sort((a, b) => ((a as { order?: number }).order ?? 99) - ((b as { order?: number }).order ?? 99));
    packs.push({ id: packDoc.id, name: data.name || packDoc.id, emoji: data.emoji, categories });
  }
  packs.sort((a, b) => (a.id === "nepal" ? -1 : b.id === "nepal" ? 1 : 0));
  return packs;
}

export async function saveCategory(
  packId: string,
  categoryId: string,
  data: { name: string; icon: string; words: WordEntry[]; order?: number }
): Promise<void> {
  await setDoc(doc(db, "packs", packId, "categories", categoryId), data);
}

export async function deleteCategory(packId: string, categoryId: string): Promise<void> {
  await deleteDoc(doc(db, "packs", packId, "categories", categoryId));
}

/** Invalidate the game's local pack cache after admin edits. */
export function clearPacksCache() {
  try {
    localStorage.removeItem("imposter-packs-cache-v2");
  } catch {}
}

// ─── Game monitoring ──────────────────────────────────────

export interface GameLog {
  id: string;
  playerCount: number;
  imposterCount: number;
  categories: string[];
  hintWord: boolean;
  hintCategory: boolean;
  createdAt: Timestamp | null;
}

/** Fire-and-forget anonymous log written when a round starts. */
export function logGameStart(data: {
  playerCount: number;
  imposterCount: number;
  categories: string[];
  hintWord: boolean;
  hintCategory: boolean;
}) {
  try {
    addDoc(collection(db, "gameLogs"), { ...data, createdAt: serverTimestamp() }).catch(() => {});
  } catch {}
}

export async function fetchGameStats(): Promise<{ total: number; recent: GameLog[] }> {
  const coll = collection(db, "gameLogs");
  const [countSnap, recentSnap] = await Promise.all([
    getCountFromServer(coll),
    getDocs(query(coll, orderBy("createdAt", "desc"), limit(20))),
  ]);
  const recent = recentSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GameLog, "id">) }));
  return { total: countSnap.data().count, recent };
}
