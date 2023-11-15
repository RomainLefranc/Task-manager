import CollectionAccordionCard from "@/components/CollectionAccordionCard";
import CreateCollectionBtn from "@/components/CreateCollectionBtn";
import SadFace from "@/components/icons/SadFace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomMsg />
      </Suspense>
      <Suspense fallback={<div>Chargement des collections...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomMsg() {
  const user = await currentUser();

  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Bienvenue, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[180px] h-[36px]" />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <SadFace />
          <AlertTitle>Il n&apos;y a pas encore de collections</AlertTitle>
          <AlertDescription>Créer une collection</AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className="flex flex-col gap-4 mt-6">
        {collections.map((collection) => (
          <CollectionAccordionCard
            key={collection.id}
            collection={collection}
          />
        ))}
      </div>
    </>
  );
}
