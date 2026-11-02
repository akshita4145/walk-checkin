import { Suspense } from "react";
import FriendStatus from "./friend-status";

async function Status({ params }: { params: PageProps<"/f/[id]">["params"] }) {
  const { id } = await params;
  return <FriendStatus id={id} />;
}

export default function FriendPage(props: PageProps<"/f/[id]">) {
  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Walk check-in</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <Status params={props.params} />
      </Suspense>
    </main>
  );
}
