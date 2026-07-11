"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminPacks, saveCategory, deleteCategory, clearPacksCache,
  type AdminPack,
} from "@/lib/firestore";
import type { Category, WordEntry } from "@/lib/packs";
import {
  PlusIcon, TrashIcon, SaveIcon, XIcon, CheckIcon, AlertIcon,
  LoaderIcon, CategoryIcon, CATEGORY_ICON_NAMES, ArrowLeftIcon,
} from "@/components/icons/SvgIcons";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

interface Editor {
  packId: string;
  categoryId: string | null; // null = creating new
  name: string;
  icon: string;
  order?: number;
  words: WordEntry[];
}

export default function AdminWordsPage() {
  const [packs, setPacks] = useState<AdminPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setPacks(await fetchAdminPacks());
    } catch {
      setMessage({ kind: "err", text: "Could not load packs from Firestore." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const openCategory = (packId: string, cat: Category & { order?: number }) => {
    setMessage(null);
    setEditor({
      packId,
      categoryId: cat.id,
      name: cat.name,
      icon: CATEGORY_ICON_NAMES.includes(cat.icon) ? cat.icon : "games",
      order: cat.order,
      words: [...cat.words, { word: "", hint: "" }],
    });
  };

  const openNew = (packId: string) => {
    setMessage(null);
    setEditor({
      packId,
      categoryId: null,
      name: "",
      icon: "games",
      words: [{ word: "", hint: "" }],
    });
  };

  const updateWord = (index: number, field: "word" | "hint", value: string) => {
    if (!editor) return;
    const words = [...editor.words];
    words[index] = { ...words[index], [field]: value };
    setEditor({ ...editor, words });
  };

  const handleSave = async () => {
    if (!editor) return;
    setMessage(null);
    const name = editor.name.trim();
    if (!name) {
      setMessage({ kind: "err", text: "Category name is required." });
      return;
    }
    const words = editor.words
      .filter((w) => w.word.trim())
      .map((w) => {
        const entry: WordEntry = { word: w.word.trim() };
        const hint = w.hint?.trim();
        if (hint) entry.hint = hint;
        return entry;
      });
    if (words.length < 3) {
      setMessage({ kind: "err", text: "At least 3 words are required." });
      return;
    }

    const pack = packs.find((p) => p.id === editor.packId);
    const categoryId = editor.categoryId || `${editor.packId}-${slugify(name)}`;
    if (!editor.categoryId && pack?.categories.some((c) => c.id === categoryId)) {
      setMessage({ kind: "err", text: "A category with this name already exists." });
      return;
    }

    setSaving(true);
    try {
      await saveCategory(editor.packId, categoryId, {
        name,
        icon: editor.icon,
        words,
        order: editor.order ?? (pack ? pack.categories.length + 1 : 99),
      });
      clearPacksCache();
      setEditor(null);
      setMessage({ kind: "ok", text: `Saved "${name}" (${words.length} words).` });
      await reload();
    } catch {
      setMessage({ kind: "err", text: "Save failed — check your connection." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editor?.categoryId) return;
    if (!confirm(`Delete "${editor.name}" and all its words? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await deleteCategory(editor.packId, editor.categoryId);
      clearPacksCache();
      setEditor(null);
      setMessage({ kind: "ok", text: "Category deleted." });
      await reload();
    } catch {
      setMessage({ kind: "err", text: "Delete failed — check your connection." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoaderIcon size={26} className="text-crimson" />
      </div>
    );
  }

  // ─── Editor view ────────────────────────────────────────
  if (editor) {
    return (
      <div>
        <button
          onClick={() => setEditor(null)}
          className="flex items-center gap-2 text-ink-muted hover:text-ink-primary text-xs font-mono uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeftIcon size={14} /> All categories
        </button>

        <h1 className="text-display text-3xl text-ink-primary mb-8">
          {editor.categoryId ? `Edit — ${editor.name || "category"}` : "New Category"}
        </h1>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2 border ${
              message.kind === "ok"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-crimson/10 border-crimson/30 text-crimson-glow"
            }`}
          >
            {message.kind === "ok" ? <CheckIcon size={15} /> : <AlertIcon size={15} />}
            {message.text}
          </div>
        )}

        <div className="card-surface p-6 mb-6">
          <label className="text-ink-muted text-xs font-mono uppercase tracking-widest block mb-2">
            Name
          </label>
          <input
            type="text"
            value={editor.name}
            onChange={(e) => setEditor({ ...editor, name: e.target.value })}
            className="input-field mb-6 max-w-md"
            placeholder="Category name"
            maxLength={40}
          />

          <label className="text-ink-muted text-xs font-mono uppercase tracking-widest block mb-2">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ICON_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setEditor({ ...editor, icon: name })}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  editor.icon === name
                    ? "bg-crimson text-white"
                    : "bg-canvas border border-hairline text-ink-muted hover:text-ink-primary hover:border-ink-muted"
                }`}
                title={name}
              >
                <CategoryIcon name={name} size={17} />
              </button>
            ))}
          </div>
        </div>

        <div className="card-surface p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">
              Words ({editor.words.filter((w) => w.word.trim()).length})
            </span>
            <button
              onClick={() => setEditor({ ...editor, words: [...editor.words, { word: "", hint: "" }] })}
              className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <PlusIcon size={13} /> Add word
            </button>
          </div>

          <div className="hidden sm:grid grid-cols-[1fr_1fr_36px] gap-2 mb-2 px-1">
            <span className="text-ink-ghost text-[10px] font-mono uppercase tracking-wider">Word (what the crew sees)</span>
            <span className="text-ink-ghost text-[10px] font-mono uppercase tracking-wider">Hint (what the imposter sees)</span>
            <span />
          </div>

          <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {editor.words.map((entry, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_36px] gap-2">
                <input
                  type="text"
                  value={entry.word}
                  onChange={(e) => updateWord(i, "word", e.target.value)}
                  className="input-field py-2.5"
                  placeholder="Word"
                />
                <input
                  type="text"
                  value={entry.hint || ""}
                  onChange={(e) => updateWord(i, "hint", e.target.value)}
                  className="input-field py-2.5"
                  placeholder="Hint (optional)"
                />
                <button
                  onClick={() => setEditor({ ...editor, words: editor.words.filter((_, idx) => idx !== i) })}
                  className="text-ink-muted hover:text-crimson transition-colors flex items-center justify-center"
                  aria-label="Remove word"
                >
                  <XIcon size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <LoaderIcon size={15} /> : <SaveIcon size={15} />}
            Save
          </button>
          <button onClick={() => setEditor(null)} className="btn-ghost py-3 px-6">
            Cancel
          </button>
          {editor.categoryId && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="ml-auto text-crimson-glow hover:bg-crimson/10 border border-crimson/30 rounded-lg py-3 px-6 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <TrashIcon size={15} />
              Delete Category
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── List view ──────────────────────────────────────────
  return (
    <div>
      <h1 className="text-display text-3xl text-ink-primary mb-2">Words</h1>
      <p className="text-ink-secondary text-sm mb-8">
        Manage the categories, words and imposter hints every player sees.
      </p>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2 border ${
            message.kind === "ok"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-crimson/10 border-crimson/30 text-crimson-glow"
          }`}
        >
          {message.kind === "ok" ? <CheckIcon size={15} /> : <AlertIcon size={15} />}
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {packs.map((pack) => (
          <div key={pack.id}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-ink-muted text-xs font-mono uppercase tracking-widest">
                {pack.emoji} {pack.name} pack
              </span>
              <button
                onClick={() => openNew(pack.id)}
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <PlusIcon size={13} /> New category
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pack.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => openCategory(pack.id, cat)}
                  className="card-surface p-5 text-left hover:border-crimson/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-crimson/10 text-crimson flex items-center justify-center mb-3 group-hover:bg-crimson/20 transition-colors">
                    <CategoryIcon name={cat.icon} size={18} />
                  </div>
                  <div className="text-ink-primary font-medium mb-1">{cat.name}</div>
                  <div className="text-ink-muted text-xs font-mono">
                    {cat.words.length} words · {cat.words.filter((w) => w.hint).length} hints
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
