// Seed Firestore word packs from the bundled JSON data.
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed-firestore.mjs
// Writes as the admin user, so it exercises the same security rules as the admin panel.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function env(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

const API_KEY = env("NEXT_PUBLIC_FIREBASE_API_KEY", readEnvLocal("NEXT_PUBLIC_FIREBASE_API_KEY"));
const PROJECT_ID = env("NEXT_PUBLIC_FIREBASE_PROJECT_ID", readEnvLocal("NEXT_PUBLIC_FIREBASE_PROJECT_ID"));
const DATABASE_ID = env("NEXT_PUBLIC_FIREBASE_DATABASE_ID", readEnvLocal("NEXT_PUBLIC_FIREBASE_DATABASE_ID") || "(default)");
const ADMIN_EMAIL = env("ADMIN_EMAIL");
const ADMIN_PASSWORD = env("ADMIN_PASSWORD");

function readEnvLocal(key) {
  try {
    const line = readFileSync(join(ROOT, ".env.local"), "utf8")
      .split("\n")
      .find((l) => l.startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim() : undefined;
  } catch {
    return undefined;
  }
}

const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents`;

function toValue(v) {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  if (v && typeof v === "object")
    return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toValue(x)])) } };
  return { nullValue: null };
}

async function signIn() {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`Sign-in failed: ${JSON.stringify(data.error)}`);
  return data.idToken;
}

async function setDoc(token, path, fields) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, toValue(v)])) }),
  });
  if (!res.ok) throw new Error(`Write ${path} failed: ${await res.text()}`);
}

const PACK_META = {
  nepal: { name: "Nepal", emoji: "🇳🇵", order: 1 },
  global: { name: "Global", emoji: "🌍", order: 2 },
};

const token = await signIn();
console.log("Signed in as", ADMIN_EMAIL);

for (const packId of Object.keys(PACK_META)) {
  await setDoc(token, `packs/${packId}`, PACK_META[packId]);
  const dir = join(ROOT, "src", "data", packId);
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  let order = 1;
  for (const file of files) {
    const cat = JSON.parse(readFileSync(join(dir, file), "utf8"));
    await setDoc(token, `packs/${packId}/categories/${cat.id}`, {
      name: cat.name,
      icon: cat.icon,
      order: order++,
      words: cat.words,
    });
    console.log(`  seeded ${packId}/${cat.id} (${cat.words.length} words)`);
  }
}
console.log("Done.");
