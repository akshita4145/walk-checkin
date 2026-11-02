import { Suspense } from "react";
import { sql } from "@/lib/db";
import WalkerView from "./walker-view";

async function Walk({ params }: { params: PageProps<"/walk/[token]">["params"] }) {
  const { token } = await params;

  const rows = await sql`
    select id, name, expected_at, arrived_at
    from walks
    where walker_token = ${token}
  `;

  if (rows.length === 0) {
    return <p>We couldn&apos;t find that walk. Check the link.</p>;
  }

  const row = rows[0];
  return (
    <WalkerView
      token={token}
      friendId={row.id}
      name={row.name}
      expectedAt={new Date(row.expected_at).toISOString()}
      arrivedAt={row.arrived_at ? new Date(row.arrived_at).toISOString() : null}
    />
  );
}

export default function WalkerPage(props: PageProps<"/walk/[token]">) {
  return (
    <main className="mx-auto w-full max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Walk check-in</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <Walk params={props.params} />
      </Suspense>
    </main>
  );
}
