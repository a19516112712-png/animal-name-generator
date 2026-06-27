"use client";

import { useState, useCallback, useRef } from "react";

interface InteractiveNamePickerProps {
  /** Flat array of all available names */
  allNames: string[];
  /** Display name of the animal (e.g. "Dog") */
  animalName: string;
  /** Emoji icon for the animal */
  icon?: string;
  /** Optional: categorized name groups for filtering */
  categories?: { key: string; label: string; names: string[] }[];
}

/** Deterministic hash for seeding on first SSR-free render */
function hashFromNames(names: string[]): number {
  if (names.length === 0) return 0;
  const s = names[0] + names.length;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function InteractiveNamePicker({
  allNames,
  animalName,
  icon = "🐾",
  categories,
}: InteractiveNamePickerProps) {
  const [currentName, setCurrentName] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const initialized = useRef(false);

  /** Get the active name pool based on current filter */
  const getActivePool = useCallback((): string[] => {
    if (!categories || filter === "all") return allNames;
    const cat = categories.find((c) => c.key === filter);
    return cat ? cat.names : allNames;
  }, [allNames, categories, filter]);

  /** Pick a random name deterministically on first render, then random on clicks */
  const pickRandomName = useCallback(
    (forceRandom = false) => {
      const pool = getActivePool();
      if (pool.length === 0) {
        setCurrentName("No names available");
        return;
      }

      if (!initialized.current) {
        // Deterministic first pick: avoid hydration mismatch
        const seed = hashFromNames(pool);
        const idx = seed % pool.length;
        setCurrentName(pool[idx]);
        initialized.current = true;
        return;
      }

      if (!forceRandom && currentName) {
        // Try to pick a different name than current
        const others = pool.filter((n) => n !== currentName);
        const pick = others.length > 0 ? others : pool;
        const idx = Math.floor(Math.random() * pick.length);
        setCurrentName(pick[idx]);
      } else {
        const idx = Math.floor(Math.random() * pool.length);
        setCurrentName(pool[idx]);
      }
    },
    [getActivePool, currentName]
  );

  const handleGenerate = () => {
    pickRandomName(true);
    setAnimKey((k) => k + 1);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!currentName) return;
    try {
      await navigator.clipboard.writeText(currentName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = currentName;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    if (!currentName) return;
    setFavorites((prev) =>
      prev.includes(currentName)
        ? prev.filter((n) => n !== currentName)
        : [...prev, currentName]
    );
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    // Re-pick after filter change (random)
    setTimeout(() => {
      const pool = categories
        ? newFilter === "all"
          ? allNames
          : categories.find((c) => c.key === newFilter)?.names || allNames
        : allNames;
      if (pool.length > 0) {
        const idx = Math.floor(Math.random() * pool.length);
        setCurrentName(pool[idx]);
        setAnimKey((k) => k + 1);
      }
    }, 50);
  };

  // Initialize on mount if not yet set
  if (!initialized.current && !currentName) {
    pickRandomName();
  }

  const isFavorite = currentName ? favorites.includes(currentName) : false;
  const activePool = getActivePool();

  return (
    <div className="bg-gradient-to-br from-primary/5 via-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-primary/10 shadow-lg shadow-primary/5">
      <div className="flex flex-col items-center gap-5">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-3xl">{icon}</span>
            Interactive {animalName} Name Picker
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tap to discover, copy, and save your favorite {animalName.toLowerCase()} names
          </p>
        </div>

        {/* Name Display Box */}
        <div
          key={animKey}
          className="bg-white rounded-2xl px-8 py-6 sm:px-12 sm:py-8 shadow-inner border-2 border-primary/20 min-w-[200px] max-w-full animate-in fade-in zoom-in duration-300"
        >
          <span className="text-3xl sm:text-5xl font-black text-gray-800 tracking-tight select-all">
            {currentName || "—"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleGenerate}
            className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary-dark active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-primary/25"
          >
            🎯 Generate Next Name
          </button>
          <button
            onClick={handleCopy}
            className={`font-semibold px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
              copied
                ? "bg-green-500 text-white shadow-md shadow-green-500/25"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary/50 hover:text-primary"
            }`}
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`font-semibold px-6 py-3 rounded-full transition-all flex items-center gap-2 ${
              isFavorite
                ? "bg-yellow-400 text-yellow-900 shadow-md shadow-yellow-400/25"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-400/50"
            }`}
          >
            {isFavorite ? "⭐ Saved" : "☆ Save"}
          </button>
        </div>

        {/* Category Filter Tabs */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                filter === "all"
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
              }`}
            >
              All Names
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleFilterChange(cat.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  filter === cat.key
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        <div className="flex gap-6 text-sm text-gray-500 mt-1">
          <span>
            <strong className="text-gray-800">{activePool.length}</strong> names in pool
          </span>
          {favorites.length > 0 && (
            <span>
              ⭐ <strong className="text-gray-800">{favorites.length}</strong> saved
            </span>
          )}
        </div>

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="w-full mt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">⭐ Your Saved Names</h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto justify-center">
              {favorites.map((name, idx) => (
                <span
                  key={idx}
                  className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-sm font-medium text-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
                  onClick={() => {
                    setCurrentName(name);
                    setAnimKey((k) => k + 1);
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
