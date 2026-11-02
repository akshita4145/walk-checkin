import StartWalkForm from "./start-walk-form";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Walk check-in</h1>
      <p className="text-foreground/60">
        Start a walk with an arrival time. If you don&apos;t tap &quot;I&apos;m home&quot; by then, your friend&apos;s
        page turns red.
      </p>
      <StartWalkForm />
      <p className="text-sm text-foreground/60">
        <strong>Privacy.</strong> This is a demo, so please don&apos;t enter real names or real plans. We store only the
        nickname you type and the walk times: when it starts, when you&apos;re due, and when you tap &quot;I&apos;m
        home&quot;. Anyone with your friend link can see your nickname, your due time and whether you&apos;re home.
        Walks are deleted after 24 hours. Our hosting providers, Vercel and Neon, may keep short-lived technical logs
        and backups beyond that.
      </p>
    </main>
  );
}
