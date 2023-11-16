import { Suspense } from "react";
import { WelcomeMsgFallback } from "@/components/WelcomeMsgFallback";
import { WelcomeMsg } from "@/components/WelcomeMsg";
import { CollectionList } from "@/components/CollectionList";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Chargement des collections...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}
