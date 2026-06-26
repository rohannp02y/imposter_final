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
  country?: string;
  emoji?: string;
  categories: Category[];
}

export interface CategorySelection {
  packId: string;
  categoryId: string;
}

import nepalCelebrities from "@/data/nepal/celebrities.json";
import nepalFood from "@/data/nepal/food.json";
import nepalPlaces from "@/data/nepal/places.json";
import nepalMovies from "@/data/nepal/movies.json";
import nepalFestivals from "@/data/nepal/festivals.json";
import nepalSlang from "@/data/nepal/slang.json";
import nepalObjects from "@/data/nepal/objects.json";
import nepalAnimals from "@/data/nepal/animals.json";
import nepalSports from "@/data/nepal/sports.json";
import globalObjects from "@/data/global/objects.json";
import globalAnimals from "@/data/global/animals.json";
import globalProfessions from "@/data/global/professions.json";
import globalMovies from "@/data/global/movies.json";

const NEPAL_CATEGORIES: Category[] = [
  nepalCelebrities as Category,
  nepalFood as Category,
  nepalPlaces as Category,
  nepalMovies as Category,
  nepalFestivals as Category,
  nepalSlang as Category,
  nepalObjects as Category,
  nepalAnimals as Category,
  nepalSports as Category,
];

const GLOBAL_CATEGORIES: Category[] = [
  globalObjects as Category,
  globalAnimals as Category,
  globalProfessions as Category,
  globalMovies as Category,
];

export const ALL_PACKS: Pack[] = [
  {
    id: "nepal",
    name: "Nepal",
    country: "Nepal",
    emoji: "🇳🇵",
    categories: NEPAL_CATEGORIES,
  },
  {
    id: "global",
    name: "Global",
    emoji: "🌍",
    categories: GLOBAL_CATEGORIES,
  },
];

export function getAllPacks(): Pack[] {
  return ALL_PACKS;
}

export function getPack(packId: string): Pack | undefined {
  return ALL_PACKS.find((p) => p.id === packId);
}

export function getCategory(
  packId: string,
  categoryId: string
): Category | undefined {
  const pack = getPack(packId);
  return pack?.categories.find((c) => c.id === categoryId);
}

export function getWords(
  packId: string,
  categoryId: string
): WordEntry[] {
  const category = getCategory(packId, categoryId);
  return category?.words || [];
}

export function getWordsFromSelection(
  selections: { packId: string; categoryId: string }[],
  customCategories: CustomCategory[] = []
): WordEntry[] {
  const words: WordEntry[] = [];

  for (const selection of selections) {
    if (selection.packId === "custom") {
      const custom = customCategories.find(
        (c) => c.id === selection.categoryId
      );
      if (custom) {
        words.push(...custom.words);
      }
    } else {
      const categoryWords = getWords(selection.packId, selection.categoryId);
      words.push(...categoryWords);
    }
  }

  return words;
}

export function getTotalWordCount(): number {
  const allWords = ALL_PACKS.flatMap((pack) =>
    pack.categories.flatMap((cat) => cat.words)
  );
  return allWords.length;
}

export function getTotalCategoryCount(): number {
  return ALL_PACKS.reduce(
    (sum, pack) => sum + pack.categories.length,
    0
  );
}

export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  words: WordEntry[];
}

export function getCustomCategories(): CustomCategory[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("imposter-custom-categories");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories: CustomCategory[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    "imposter-custom-categories",
    JSON.stringify(categories)
  );
}

export function addCustomCategory(
  category: Omit<CustomCategory, "id">
): CustomCategory {
  const newCategory: CustomCategory = {
    ...category,
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  };
  const existing = getCustomCategories();
  saveCustomCategories([...existing, newCategory]);
  return newCategory;
}

export function updateCustomCategory(
  id: string,
  updates: Partial<CustomCategory>
): void {
  const existing = getCustomCategories();
  const updated = existing.map((c) =>
    c.id === id ? { ...c, ...updates } : c
  );
  saveCustomCategories(updated);
}

export function deleteCustomCategory(id: string): void {
  const existing = getCustomCategories();
  saveCustomCategories(existing.filter((c) => c.id !== id));
}
