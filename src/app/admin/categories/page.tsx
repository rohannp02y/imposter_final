"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  getAllPacks,
  getCustomCategories,
  addCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
  type Pack,
  type Category,
  type CustomCategory,
  type WordEntry,
} from "@/lib/packs";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("🎯");
  const [editWords, setEditWords] = useState<WordEntry[]>([{ word: "", hint: "" }]);
  const [editPackId, setEditPackId] = useState("nepal");

  const loadData = () => {
    setPacks(getAllPacks());
    setCustomCategories(getCustomCategories());
  };

  useEffect(() => {
    loadData();
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditName("");
    setEditIcon("🎯");
    setEditWords([{ word: "", hint: "" }]);
    setEditPackId("nepal");
    setError("");
  };

  const startEdit = (cat: Category | CustomCategory, packId?: string) => {
    setIsCreating(false);
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
    setEditWords([...cat.words, { word: "", hint: "" }]);
    setEditPackId(packId || "custom");
    setError("");
  };

  const addWordRow = () => {
    setEditWords([...editWords, { word: "", hint: "" }]);
  };

  const updateWord = (index: number, field: "word" | "hint", value: string) => {
    const updated = [...editWords];
    updated[index] = { ...updated[index], [field]: value };
    setEditWords(updated);
  };

  const removeWord = (index: number) => {
    setEditWords(editWords.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setError("");
    if (!editName.trim()) {
      setError("Category name is required");
      return;
    }
    const validWords = editWords.filter((w) => w.word.trim());
    if (validWords.length < 3) {
      setError("At least 3 words required");
      return;
    }

    if (editingId) {
      updateCustomCategory(editingId, {
        name: editName.trim(),
        icon: editIcon,
        words: validWords,
      });
    } else {
      addCustomCategory({
        name: editName.trim(),
        icon: editIcon,
        words: validWords,
      });
    }

    loadData();
    setEditingId(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) {
      deleteCustomCategory(id);
      loadData();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-white/50 text-sm mt-1">Manage word packs and categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="btn-ghost text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={startCreate} className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4 inline mr-1" />
            New Category
          </button>
        </div>
      </div>

      {(isCreating || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Category" : "New Custom Category"}
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <div className="w-16">
              <label className="text-sm text-white/50 block mb-2">Icon</label>
              <input
                type="text"
                value={editIcon}
                onChange={(e) => setEditIcon(e.target.value)}
                className="input-field text-center text-2xl"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-white/50 block mb-2">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field"
                placeholder="Category name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-white/50 block mb-2">
              Words ({editWords.filter((w) => w.word.trim()).length})
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
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
                    placeholder="Hint (optional)"
                  />
                  <button
                    onClick={() => removeWord(i)}
                    className="text-white/30 hover:text-red-400 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addWordRow} className="btn-ghost text-sm mt-2">
              <Plus className="w-4 h-4 inline mr-1" />
              Add Word
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setEditingId(null); setIsCreating(false); }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary flex-1">
              Save
            </button>
          </div>
        </motion.div>
      )}

      {/* Built-in Packs */}
      {packs.map((pack) => (
        <div key={pack.id} className="mb-8">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <span className="text-2xl">{pack.emoji}</span>
            {pack.name} Pack
            <span className="text-sm text-white/40 font-normal">
              ({pack.categories.length} categories)
            </span>
          </h2>
          <div className="space-y-2">
            {pack.categories.map((cat) => (
              <div
                key={cat.id}
                className="card p-4 flex items-center gap-4"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-sm text-white/40">{cat.words.length} words</div>
                </div>
                <button
                  onClick={() => startEdit(cat, pack.id)}
                  className="btn-ghost text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Custom Categories */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <span className="text-2xl">✏️</span>
          Custom Categories
          <span className="text-sm text-white/40 font-normal">
            ({customCategories.length})
          </span>
        </h2>
        {customCategories.length === 0 ? (
          <div className="card p-8 text-center text-white/40">
            No custom categories yet
          </div>
        ) : (
          <div className="space-y-2">
            {customCategories.map((cat) => (
              <div key={cat.id} className="card p-4 flex items-center gap-4">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-sm text-white/40">{cat.words.length} words</div>
                </div>
                <button
                  onClick={() => startEdit(cat)}
                  className="btn-ghost text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-white/30 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
