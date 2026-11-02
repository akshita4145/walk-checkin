"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const DURATIONS = [1, 15, 30, 45, 60];

export default function StartWalkForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState(15);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/walks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, minutes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setBusy(false);
        return;
      }
      // Stay "busy" while navigating so the button can't be pressed twice.
      router.push(`/walk/${data.walkerToken}`);
    } catch {
      setError("Could not reach the server");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-foreground/60">Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
          className="mt-1 w-full rounded-lg border border-foreground/20 bg-background p-3"
        />
      </label>
      <label className="block">
        <span className="text-sm text-foreground/60">How long will you walk?</span>
        <select
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-foreground/20 bg-background p-3"
        >
          {DURATIONS.map((m) => (
            <option key={m} value={m}>
              {m === 1 ? "1 minute (demo)" : `${m} minutes`}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-foreground p-3 font-medium text-background disabled:opacity-50"
      >
        {busy ? "Starting…" : "Start walk"}
      </button>
    </form>
  );
}
