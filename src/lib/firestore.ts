import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ────────────────────────────────────────────────

export interface FirebaseUser {
  uid: string;
  username: string;
  email: string;
  avatar: string;
  color: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface FirebaseGame {
  code: string;
  hostId: string;
  status: string;
  maxPlayers: number;
  minPlayers: number;
  numImposters: number;
  mapName: string;
  discussionTime: number;
  votingTime: number;
  killCooldown: number;
  taskCount: number;
  isPublic: boolean;
  isPassAndPlay: boolean;
  players: string[];
  createdAt: string;
}

// ─── User Operations ──────────────────────────────────────

export async function createUser(user: Omit<FirebaseUser, "isAdmin" | "createdAt">) {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    ...user,
    isAdmin: false,
    createdAt: serverTimestamp(),
  });

  const statsRef = doc(db, "userStats", user.uid);
  await setDoc(statsRef, {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    imposterGames: 0,
    imposterWins: 0,
    crewGames: 0,
    crewWins: 0,
    totalKills: 0,
    totalTasks: 0,
    elo: 1000,
    winStreak: 0,
    bestStreak: 0,
    createdAt: serverTimestamp(),
  });

  return userRef;
}

export async function getUser(uid: string): Promise<FirebaseUser | null> {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...snapshot.data() } as FirebaseUser;
}

export async function updateUser(uid: string, data: Partial<FirebaseUser>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
}

export async function isAdmin(uid: string): Promise<boolean> {
  const user = await getUser(uid);
  return user?.isAdmin === true;
}

// ─── Game Operations ──────────────────────────────────────

export async function createGame(game: Omit<FirebaseGame, "createdAt">) {
  const gameRef = doc(db, "games", game.code);
  await setDoc(gameRef, {
    ...game,
    createdAt: serverTimestamp(),
  });
  return gameRef;
}

export async function getGame(code: string): Promise<FirebaseGame | null> {
  const gameRef = doc(db, "games", code);
  const snapshot = await getDoc(gameRef);
  if (!snapshot.exists()) return null;
  return { code: snapshot.id, ...snapshot.data() } as FirebaseGame;
}

export async function updateGame(code: string, data: Partial<FirebaseGame>) {
  const gameRef = doc(db, "games", code);
  await updateDoc(gameRef, data);
}

export async function getPublicGames(): Promise<FirebaseGame[]> {
  const q = query(
    collection(db, "games"),
    where("isPublic", "==", true),
    where("status", "==", "WAITING"),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    code: doc.id,
    ...doc.data(),
  })) as FirebaseGame[];
}

// ─── Stats Operations ─────────────────────────────────────

export async function updateStats(uid: string, data: Record<string, number>) {
  const statsRef = doc(db, "userStats", uid);
  const snapshot = await getDoc(statsRef);

  if (snapshot.exists()) {
    const current = snapshot.data();
    const updated: Record<string, number> = {};
    for (const [key, value] of Object.entries(data)) {
      updated[key] = (current[key] || 0) + value;
    }
    await updateDoc(statsRef, updated);
  }
}

export async function getLeaderboard(count: number = 50) {
  const q = query(
    collection(db, "userStats"),
    orderBy("elo", "desc"),
    limit(count)
  );
  const snapshot = await getDocs(q);

  const results = [];
  for (const doc of snapshot.docs) {
    const user = await getUser(doc.id);
    results.push({
      userId: doc.id,
      username: user?.username || "Unknown",
      color: user?.color || "#EF4444",
      ...doc.data(),
    });
  }

  return results;
}

// ─── Word Pack Operations (Admin) ─────────────────────────

export interface FirestoreCategory {
  id: string;
  name: string;
  icon: string;
  words: Array<{ word: string; hint?: string }>;
}

export async function getAllPacks(): Promise<Record<string, FirestoreCategory[]>> {
  const packsSnapshot = await getDocs(collection(db, "packs"));
  const packs: Record<string, FirestoreCategory[]> = {};

  for (const packDoc of packsSnapshot.docs) {
    const categoriesSnapshot = await getDocs(
      collection(db, "packs", packDoc.id, "categories")
    );
    packs[packDoc.id] = categoriesSnapshot.docs.map((catDoc) => ({
      id: catDoc.id,
      ...catDoc.data(),
    })) as FirestoreCategory[];
  }

  return packs;
}

export async function saveCategory(packId: string, category: FirestoreCategory) {
  const catRef = doc(db, "packs", packId, "categories", category.id);
  await setDoc(catRef, {
    name: category.name,
    icon: category.icon,
    words: category.words,
  });
}

export async function deleteCategory(packId: string, categoryId: string) {
  const catRef = doc(db, "packs", packId, "categories", categoryId);
  await deleteDoc(catRef);
}

// ─── Real-time Listeners ──────────────────────────────────

export function onGameUpdate(code: string, callback: (game: FirebaseGame | null) => void) {
  const gameRef = doc(db, "games", code);
  return onSnapshot(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ code: snapshot.id, ...snapshot.data() } as FirebaseGame);
    } else {
      callback(null);
    }
  });
}
