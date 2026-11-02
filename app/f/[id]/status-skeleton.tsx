// Same three-line shape as the real status card, so the page doesn't jump when
// the status arrives. The hidden text holds the card's height.
export default function StatusSkeleton() {
  return (
    <div
      role="status"
      className="rounded-2xl border border-foreground/20 bg-foreground/5 p-8 text-center motion-safe:animate-pulse"
    >
      <span className="sr-only">Loading walk status…</span>
      <div aria-hidden className="invisible">
        <p className="text-xl font-semibold">Name</p>
        <p className="text-4xl font-bold">Walking</p>
        <p className="mt-2 text-sm">Expected home by 12:00 AM</p>
      </div>
    </div>
  );
}
