"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PlusIcon, EditIcon, TrashIcon, SaveIcon, ArrowLeftIcon,
  TagsIcon, AlertIcon, XIcon, CategoryIcon, CATEGORY_ICON_NAMES,
} from "@/components/icons/SvgIcons";
import {
  getCustomCategories, addCustomCategory, updateCustomCategory, deleteCustomCategory,
  type CustomCategory, type WordEntry,
} from "@/lib/packs";

export default function CustomPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("games");
  const [editWords, setEditWords] = useState<WordEntry[]>([{ word: "", hint: "" }]);

  useEffect(() => {
    setCategories(getCustomCategories());
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditName("");
    setEditIcon("games");
    setEditWords([{ word: "", hint: "" }]);
    setError("");
  };

  const startEdit = (cat: CustomCategory) => {
    setIsCreating(false);
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(CATEGORY_ICON_NAMES.includes(cat.icon) ? cat.icon : "games");
    setEditWords([...cat.words, { word: "", hint: "" }]);
    setError("");
  };

  const updateWord = (index: number, field: "word" | "hint", value: string) => {
    const updated = [...editWords];
    updated[index] = { ...updated[index], [field]: value };
    setEditWords(updated);
  };

  const handleSave = () => {
    setError("");
    if (!editName.trim()) {
      setError("Category name is required");
      return;
    }
    const validWords = editWords
      .filter((w) => w.word.trim())
      .map((w) => ({ word: w.word.trim(), hint: w.hint?.trim() || undefined }));
    if (validWords.length < 3) {
      setError("At least 3 words are required");
      return;
    }

    if (editingId) {
      updateCustomCategory(editingId, { name: editName.trim(), icon: editIcon, words: validWords });
    } else {
      addCustomCategory({ name: editName.trim(), icon: editIcon, words: validWords });
    }
    setCategories(getCustomCategories());
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) {
      deleteCustomCategory(id);
      setCategories(getCustomCategories());
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setError("");
  };

  const editorOpen = isCreating || editingId !== null;

  return (
    <div className="min-h-screen pt-24 pb-10 px-6 relative">
      <div className="absolute inset-0 gradient-mesh opacity-20 pointer-events-none" />
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => router.push("/")}
              className="btn-ghost p-3"
              aria-label="Back"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <div>
              <h1 className="text-display text-3xl md:text-4xl text-ink-primary">Custom Words</h1>
              <p className="text-ink-secondary text-sm mt-1">
                Build your own categories — stored on this device.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {editorOpen && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-surface p-6 mb-6"
              >
                <h2 className="text-ink-primary text-lg font-medium mb-5">
                  {editingId ? "Edit Category" : "New Category"}
                </h2>

                {error && (
                  <div className="bg-crimson/10 border border-crimson/30 text-crimson-glow px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                    <AlertIcon size={15} />
                    {error}
                  </div>
                )}

                <label className="text-ink-muted text-xs font-mono uppercase tracking-widest block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field mb-5"
                  placeholder="e.g. Office Inside Jokes"
                  maxLength={30}
                />

                <label className="text-ink-muted text-xs font-mono uppercase tracking-widest block mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2 mb-5">
                  {CATEGORY_ICON_NAMES.map((name) => (
                    <button
                      key={name}
                      onClick={() => setEditIcon(name)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        editIcon === name
                          ? "bg-crimson text-white"
                          : "bg-canvas border border-hairline text-ink-muted hover:text-ink-primary hover:border-ink-muted"
                      }`}
                      title={name}
                    >
                      <CategoryIcon name={name} size={17} />
                    </button>
                  ))}
                </div>

                <label className="text-ink-muted text-xs font-mono uppercase tracking-widest block mb-2">
                  Words ({editWords.filter((w) => w.word.trim()).length})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 mb-3">
                  {editWords.map((entry, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={entry.word}
                        onChange={(e) => updateWord(i, "word", e.target.value)}
                        className="input-field flex-1"
                        placeholder="Word"
                      />
                      <input
                        type="text"
                        value={entry.hint || ""}
                        onChange={(e) => updateWord(i, "hint", e.target.value)}
                        className="input-field flex-1"
                        placeholder="Imposter hint (optional)"
                      />
                      <button
                        onClick={() => setEditWords(editWords.filter((_, idx) => idx !== i))}
                        className="text-ink-muted hover:text-crimson px-2 transition-colors"
                        aria-label="Remove word"
                      >
                        <XIcon size={15} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setEditWords([...editWords, { word: "", hint: "" }])}
                  className="btn-ghost text-sm py-2.5 px-4 flex items-center gap-2 mb-6"
                >
                  <PlusIcon size={14} />
                  Add Word
                </button>

                <div className="flex gap-3">
                  <button onClick={handleCancel} className="btn-ghost flex-1">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <SaveIcon size={15} />
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-ink-primary font-medium">
              Your Categories ({categories.length})
            </h2>
            {!editorOpen && (
              <button onClick={startCreate} className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2">
                <PlusIcon size={14} />
                New
              </button>
            )}
          </div>

          {categories.length === 0 ? (
            <div className="card-surface p-12 text-center">
              <TagsIcon size={40} className="text-ink-ghost mx-auto mb-4" />
              <h3 className="text-ink-primary text-lg font-medium mb-2">No custom categories yet</h3>
              <p className="text-ink-secondary text-sm mb-6">
                Inside jokes, classmates, local spots — anything goes.
              </p>
              <button onClick={startCreate} className="btn-primary">
                Create Category
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <motion.div key={cat.id} layout className="card-surface p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-crimson/10 text-crimson flex items-center justify-center shrink-0">
                    <CategoryIcon name={cat.icon} size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-ink-primary font-medium truncate">{cat.name}</div>
                    <div className="text-ink-muted text-xs font-mono">{cat.words.length} words</div>
                  </div>
                  <button
                    onClick={() => startEdit(cat)}
                    className="btn-ghost p-2.5"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <EditIcon size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-ink-muted hover:text-crimson transition-colors p-2"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <TrashIcon size={15} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
