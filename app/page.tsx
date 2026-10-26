import StartWalkForm from "./start-walk-form";

export default function Home() {
  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Walk check-in</h1>
      <p className="text-foreground/60">
        Start a walk with an arrival time. If you don&apos;t tap &quot;I&apos;m home&quot; by then, your friend&apos;s
        page turns red.
      </p>
      <StartWalkForm />
    </main>
  );
}
