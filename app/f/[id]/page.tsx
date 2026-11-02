import { Suspense } from "react";
import FriendStatus from "./friend-status";
import StatusSkeleton from "./status-skeleton";

async function Status({ params }: { params: PageProps<"/f/[id]">["params"] }) {
  const { id } = await params;
  return <FriendStatus id={id} />;
}

export default function FriendPage(props: PageProps<"/f/[id]">) {
  return (
    <main className="mx-auto w-full max-w-md space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Walk check-in</h1>
      <Suspense fallback={<StatusSkeleton />}>
        <Status params={props.params} />
      </Suspense>
    </main>
  );
}
