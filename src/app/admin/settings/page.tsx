"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  RefreshCw,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    defaultImposters: 1,
    defaultTimer: null as number | null,
    defaultHints: false,
    maxPlayers: 10,
    minPlayers: 3,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("imposter-admin-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearAllData = () => {
    if (confirm("This will clear ALL local data including custom categories, players, and settings. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-white/50 mb-8">Configure default game settings</p>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Default Game Settings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/50 block mb-2">Default Imposters</label>
            <select
              value={settings.defaultImposters}
              onChange={(e) =>
                setSettings({ ...settings, defaultImposters: Number(e.target.value) })
              }
              className="input-field"
            >
              {[1, 2, 3].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/50 block mb-2">Default Timer</label>
            <select
              value={settings.defaultTimer ?? ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultTimer: e.target.value ? Number(e.target.value) : null,
                })
              }
              className="input-field"
            >
              <option value="">Off</option>
              <option value="60">1 min</option>
              <option value="90">1.5 min</option>
              <option value="120">2 min</option>
              <option value="180">3 min</option>
              <option value="300">5 min</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/50 block mb-2">Max Players</label>
            <select
              value={settings.maxPlayers}
              onChange={(e) =>
                setSettings({ ...settings, maxPlayers: Number(e.target.value) })
              }
              className="input-field"
            >
              {[6, 8, 10, 12].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/50 block mb-2">Min Players</label>
            <select
              value={settings.minPlayers}
              onChange={(e) =>
                setSettings({ ...settings, minPlayers: Number(e.target.value) })
              }
              className="input-field"
            >
              {[3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="checkbox"
            id="defaultHints"
            checked={settings.defaultHints}
            onChange={(e) =>
              setSettings({ ...settings, defaultHints: e.target.checked })
            }
            className="w-5 h-5 rounded bg-imposter-dark-lighter border-white/20 text-imposter-red focus:ring-imposter-red"
          />
          <label htmlFor="defaultHints" className="text-sm">
            Enable hints for imposters by default
          </label>
        </div>

        <button onClick={handleSave} className="btn-primary mt-6">
          {saved ? (
            <>Saved!</>
          ) : (
            <>
              <Save className="w-4 h-4 inline mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      <div className="card p-6 border border-red-500/20">
        <h2 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-white/50 mb-4">
          Clear all locally stored data including custom categories, player roster, and settings.
          This cannot be undone.
        </p>
        <button
          onClick={handleClearAllData}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Local Data
        </button>
      </div>
    </div>
  );
}
