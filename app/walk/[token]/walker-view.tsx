"use client";

import { useState, useSyncExternalStore } from "react";

type Props = {
  token: string;
  friendId: string;
  name: string;
  expectedAt: string;
  arrivedAt: string | null;
};

// True in the browser, false while the server renders. Lets us show local times
// and the page's origin without a server/browser mismatch.
const subscribe = () => () => {};
const useIsBrowser = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export default function WalkerView({ token, friendId, name, expectedAt, arrivedAt }: Props) {
  const isBrowser = useIsBrowser();
  const [arrived, setArrived] = useState(arrivedAt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyFriendLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/f/${friendId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the link is still shown to select by hand.
    }
  }

  async function imHome() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/walks/arrive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walkerToken: token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setArrived(data.arrivedAt);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  // Stored in UTC; shown in the viewer's local time.
  const due = isBrowser
    ? new Date(expectedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "…";
  const friendLink = isBrowser ? `${window.location.origin}/f/${friendId}` : "";

  return (
    <div className="space-y-6">
      {arrived ? (
        <div className="rounded-2xl border border-green-700 bg-green-600 p-8 text-center text-white">
          <p className="text-4xl font-bold">You&apos;re home</p>
          <p className="mt-2 text-sm opacity-80">Your friend can see you&apos;re safe.</p>
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="text-foreground/60">{name}, you&apos;re walking home.</p>
            <p className="text-xl font-semibold">Expected home by {due}</p>
          </div>
          <button
            onClick={imHome}
            disabled={busy}
            className="w-full rounded-2xl bg-green-600 p-6 text-2xl font-bold text-white disabled:opacity-50"
          >
            {busy ? "Saving…" : "I'm home"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </>
      )}

      <div>
        <p className="text-sm text-foreground/60">Your friend&apos;s link</p>
        <p className="break-all rounded-lg border border-foreground/20 p-3 text-sm">{friendLink}</p>
        <button
          onClick={copyFriendLink}
          className="mt-2 w-full rounded-lg border border-foreground/20 p-3 text-sm font-medium"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
