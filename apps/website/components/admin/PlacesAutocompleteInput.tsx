"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Suggestion {
  placeId: string;
  main: string;
  secondary: string;
  value: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PlacesAutocompleteInput({
  value,
  onChange,
  placeholder = "Search for a location…",
  className,
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fetching, setFetching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setFetching(true);
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setOpen((data.suggestions ?? []).length > 0);
        setActiveIndex(-1);
      }
    } catch {
      // fail silently — still usable as plain text input
    } finally {
      setFetching(false);
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

  function handleSelect(suggestion: Suggestion) {
    onChange(suggestion.value);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const inputClass =
    className ??
    "w-full bg-[var(--color-dark-bg)] border border-[rgba(245,237,214,0.1)] rounded-[6px] px-[12px] py-[9px] text-[13px] text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]";

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClass}
        />
        {fetching && (
          <span className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full border-2 border-[var(--color-gold)] border-t-transparent animate-spin" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-[100] left-0 right-0 top-full mt-[3px] bg-[var(--color-dark-surface)] border border-[rgba(245,237,214,0.1)] rounded-[6px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)] max-h-[220px] overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.placeId || i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
              className={`px-[14px] py-[10px] cursor-pointer transition-colors ${
                i === activeIndex
                  ? "bg-[rgba(201,168,76,0.12)] text-[var(--color-cream)]"
                  : "hover:bg-[rgba(245,237,214,0.05)] text-[rgba(245,237,214,0.75)]"
              }`}
            >
              <p className="text-[13px] font-medium leading-tight">{s.main}</p>
              {s.secondary && (
                <p className="text-[11px] text-[rgba(245,237,214,0.4)] mt-[2px]">{s.secondary}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
