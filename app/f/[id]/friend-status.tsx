"use client";

import { useEffect, useState } from "react";
import StatusSkeleton from "./status-skeleton";

type WalkInfo = {
  name: string;
  expectedAt: string;
  arrivedAt: string | null;
  status: "walking" | "overdue" | "home";
};

const POLL_MS = 5000;

const LOOK = {
  walking: { label: "Walking", box: "border-foreground/20 bg-foreground/5" },
  overdue: { label: "Overdue", box: "border-status-overdue-edge bg-status-overdue text-white" },
  home: { label: "Home safe", box: "border-status-home-edge bg-status-home text-white" },
} as const;

export default function FriendStatus({ id }: { id: string }) {
  const [walk, setWalk] = useState<WalkInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let stopped = false;

    async function load() {
      try {
        const res = await fetch(`/api/walks/${id}`, { cache: "no-store" });
        if (stopped) return;
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        setWalk(await res.json());
        setOffline(false);
      } catch {
        if (!stopped) setOffline(true);
      }
    }

    load();
    const timer = setInterval(load, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [id]);

  if (notFound) return <p>We couldn&apos;t find that walk. Check the link.</p>;
  if (!walk) return <StatusSkeleton />;

  const look = LOOK[walk.status];
  // Stored in UTC; shown in the viewer's local time.
  const due = new Date(walk.expectedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="space-y-3">
      {/* A live region, so a screen reader announces when the status changes. */}
      <div role="status" aria-atomic="true" className={`rounded-2xl border p-8 text-center ${look.box}`}>
        <p className="text-xl font-semibold">{walk.name}</p>
        <p className="text-4xl font-bold">{look.label}</p>
        <p className="mt-2 text-sm">Expected home by {due}</p>
      </div>
      {offline && <p className="text-sm text-foreground/60">Can&apos;t reach the server. Showing the last known status.</p>}
    </div>
  );
}
