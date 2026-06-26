"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  ArrowLeft,
  Tag,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  getCustomCategories,
  addCustomCategory,
  updateCustomCategory,
  deleteCustomCategory,
  type CustomCategory,
  type WordEntry,
} from "@/lib/packs";

export default function CustomPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("🎯");
  const [editWords, setEditWords] = useState<WordEntry[]>([
    { word: "", hint: "" },
  ]);

  useEffect(() => {
    setCategories(getCustomCategories());
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditName("");
    setEditIcon("🎯");
    setEditWords([{ word: "", hint: "" }]);
    setError("");
  };

  const startEdit = (cat: CustomCategory) => {
    setIsCreating(false);
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon);
    setEditWords([...cat.words, { word: "", hint: "" }]);
    setError("");
  };

  const addWordRow = () => {
    setEditWords([...editWords, { word: "", hint: "" }]);
  };

  const updateWord = (
    index: number,
    field: "word" | "hint",
    value: string
  ) => {
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
      setError("At least 3 words are required");
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

    setCategories(getCustomCategories());
    setEditingId(null);
    setIsCreating(false);
    setEditWords([{ word: "", hint: "" }]);
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

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push("/game/pass-and-play")}
              className="btn-ghost"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-gradient">Custom Categories</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Create your own word categories
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {(isCreating || editingId) && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card p-6 mb-6"
              >
                <h2 className="text-lg font-semibold mb-4">
                  {editingId ? "Edit Category" : "New Category"}
                </h2>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex gap-4 mb-4">
                  <div className="w-16">
                    <label className="text-sm text-white/50 block mb-2">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      className="input-field text-center text-2xl"
                      maxLength={2}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-white/50 block mb-2">
                      Name
                    </label>
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
                          onChange={(e) =>
                            updateWord(i, "word", e.target.value)
                          }
                          className="input-field flex-1"
                          placeholder="Word"
                        />
                        <input
                          type="text"
                          value={entry.hint || ""}
                          onChange={(e) =>
                            updateWord(i, "hint", e.target.value)
                          }
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
                  <button
                    onClick={addWordRow}
                    className="btn-ghost text-sm mt-2"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Word
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleCancel} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary flex-1">
                    <Save className="w-4 h-4 inline mr-2" />
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              Your Categories ({categories.length})
            </h2>
            {!isCreating && !editingId && (
              <button onClick={startCreate} className="btn-primary text-sm py-2">
                <Plus className="w-4 h-4 inline mr-1" />
                New
              </button>
            )}
          </div>

          {categories.length === 0 ? (
            <div className="card p-12 text-center">
              <Tag className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No Custom Categories</h3>
              <p className="text-white/50 text-sm mb-4">
                Create your own word categories to play with
              </p>
              <button onClick={startCreate} className="btn-primary">
                Create Category
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  layout
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="text-3xl">{cat.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-white/50">
                      {cat.words.length} words
                    </div>
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
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
