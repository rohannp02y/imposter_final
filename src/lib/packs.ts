export interface WordEntry {
  word: string;
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  packId: string;
  words: WordEntry[];
}

export interface Pack {
  id: string;
  name: string;
  emoji?: string;
  categories: Category[];
}

export interface CategorySelection {
  packId: string;
  categoryId: string;
}

/** A word plus the category it came from — needed for the imposter's theme hint. */
export interface PoolEntry extends WordEntry {
  categoryId: string;
  categoryName: string;
}

import nepalCelebrities from "@/data/nepal/celebrities.json";
import nepalFood from "@/data/nepal/food.json";
import nepalPlaces from "@/data/nepal/places.json";
import nepalMovies from "@/data/nepal/movies.json";
import nepalFestivals from "@/data/nepal/festivals.json";
import nepalRiddles from "@/data/nepal/riddles.json";
import nepalObjects from "@/data/nepal/objects.json";
import nepalAnimals from "@/data/nepal/animals.json";
import nepalSports from "@/data/nepal/sports.json";
import globalObjects from "@/data/global/objects.json";
import globalAnimals from "@/data/global/animals.json";
import globalProfessions from "@/data/global/professions.json";
import globalMovies from "@/data/global/movies.json";
import globalFood from "@/data/global/food.json";
import globalPlaces from "@/data/global/places.json";
import globalActivities from "@/data/global/activities.json";
import globalMusic from "@/data/global/music.json";
import globalBrands from "@/data/global/brands.json";
import globalTv from "@/data/global/tv.json";

const NEPAL_CATEGORIES: Category[] = [
  nepalFood as Category,
  nepalPlaces as Category,
  nepalCelebrities as Category,
  nepalMovies as Category,
  nepalFestivals as Category,
  nepalRiddles as Category,
  nepalObjects as Category,
  nepalAnimals as Category,
  nepalSports as Category,
];

const GLOBAL_CATEGORIES: Category[] = [
  globalFood as Category,
  globalPlaces as Category,
  globalObjects as Category,
  globalAnimals as Category,
  globalProfessions as Category,
  globalMovies as Category,
  globalTv as Category,
  globalMusic as Category,
  globalBrands as Category,
  globalActivities as Category,
];

/** Bundled packs — the offline fallback and the Firestore seed source. */
export const BUNDLED_PACKS: Pack[] = [
  { id: "nepal", name: "Nepal", emoji: "🇳🇵", categories: NEPAL_CATEGORIES },
  { id: "global", name: "Global", emoji: "🌍", categories: GLOBAL_CATEGORIES },
];

// ─── Live packs (Firestore-backed with cache + fallback) ──

const PACKS_CACHE_KEY = "imposter-packs-cache-v2";
const PACKS_CACHE_TTL = 1000 * 60 * 30; // 30 min

function readPacksCache(): Pack[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PACKS_CACHE_KEY);
    if (!raw) return null;
    const { ts, packs } = JSON.parse(raw);
    if (Date.now() - ts > PACKS_CACHE_TTL) return null;
    if (!Array.isArray(packs) || packs.length === 0) return null;
    return packs as Pack[];
  } catch {
    return null;
  }
}

function writePacksCache(packs: Pack[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PACKS_CACHE_KEY, JSON.stringify({ ts: Date.now(), packs }));
  } catch {}
}

/**
 * Load packs from Firestore (admin-managed). Falls back to the freshest of
 * cache → bundled data. Never throws.
 */
export async function loadPacks(): Promise<Pack[]> {
  const cached = readPacksCache();
  if (cached) return cached;

  try {
    const { collection, getDocs } = await import("firebase/firestore");
    const { db } = await import("./firebase");

    const packsSnap = await getDocs(collection(db, "packs"));
    if (packsSnap.empty) return BUNDLED_PACKS;

    const packs: Pack[] = [];
    for (const packDoc of packsSnap.docs) {
      const data = packDoc.data() as { name?: string; emoji?: string; order?: number };
      const catsSnap = await getDocs(collection(db, "packs", packDoc.id, "categories"));
      const categories = catsSnap.docs
        .map((c) => ({ id: c.id, packId: packDoc.id, ...(c.data() as Omit<Category, "id" | "packId">) }))
        .filter((c) => Array.isArray(c.words) && c.words.length > 0)
        .sort((a, b) => ((a as { order?: number }).order ?? 99) - ((b as { order?: number }).order ?? 99));
      packs.push({
        id: packDoc.id,
        name: data.name || packDoc.id,
        emoji: data.emoji,
        categories,
      });
    }
    packs.sort((a, b) => (a.id === "nepal" ? -1 : b.id === "nepal" ? 1 : 0));

    const valid = packs.filter((p) => p.categories.length > 0);
    if (valid.length === 0) return BUNDLED_PACKS;
    writePacksCache(valid);
    return valid;
  } catch {
    return BUNDLED_PACKS;
  }
}

// ─── Selection helpers ────────────────────────────────────

export function getCategory(packs: Pack[], packId: string, categoryId: string): Category | undefined {
  return packs.find((p) => p.id === packId)?.categories.find((c) => c.id === categoryId);
}

/**
 * Build the word pool for a game from the selected categories,
 * tagging every word with the category it came from.
 */
export function getWordPool(
  packs: Pack[],
  selections: CategorySelection[],
  customCategories: CustomCategory[] = []
): PoolEntry[] {
  const pool: PoolEntry[] = [];
  for (const sel of selections) {
    if (sel.packId === "custom") {
      const custom = customCategories.find((c) => c.id === sel.categoryId);
      if (custom) {
        for (const w of custom.words) {
          pool.push({ ...w, categoryId: custom.id, categoryName: custom.name });
        }
      }
    } else {
      const cat = getCategory(packs, sel.packId, sel.categoryId);
      if (cat) {
        for (const w of cat.words) {
          pool.push({ ...w, categoryId: cat.id, categoryName: cat.name });
        }
      }
    }
  }
  return pool;
}

// ─── Custom categories (device-local) ─────────────────────

export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  words: WordEntry[];
}

const CUSTOM_KEY = "imposter-custom-categories";

export function getCustomCategories(): CustomCategory[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CUSTOM_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories: CustomCategory[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(categories));
}

export function addCustomCategory(category: Omit<CustomCategory, "id">): CustomCategory {
  const newCategory: CustomCategory = {
    ...category,
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  };
  saveCustomCategories([...getCustomCategories(), newCategory]);
  return newCategory;
}

export function updateCustomCategory(id: string, updates: Partial<CustomCategory>): void {
  saveCustomCategories(
    getCustomCategories().map((c) => (c.id === id ? { ...c, ...updates } : c))
  );
}

export function deleteCustomCategory(id: string): void {
  saveCustomCategories(getCustomCategories().filter((c) => c.id !== id));
}
