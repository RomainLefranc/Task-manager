import CollectionAccordionCard from "@/components/CollectionAccordionCard";
import CreateCollectionBtn from "@/components/CreateCollectionBtn";
import SadFace from "@/components/icons/SadFace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export async function CollectionList() {
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
