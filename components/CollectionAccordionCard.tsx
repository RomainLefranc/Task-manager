"use client";
import { Collection, Task } from "@prisma/client";
import React, { useMemo, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, TrashIcon } from "@radix-ui/react-icons";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import PlusIcon from "./icons/PlusIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskCard from "./TaskCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
}

function CollectionAccordionCard({ collection }: Props) {
  const router = useRouter();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const tasks = collection.tasks;

  const [isLoading, startTransition] = useTransition();

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast({
        title: "Succès",
        description: "La collection a été supprimé avec succès",
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la collection",
        variant: "destructive",
      });
    }
  };

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const totalTasks = collection.tasks.length;

  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "flex w-full justify-between p-6 [&[data-state=open]]:rounded-b-none",
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              <span className="text-white font-bold">{collection.name}</span>
              <CaretDownIcon className="h-6 w-6 transition-[transform] [&[data-state=open]>svg]:rotate-180" />
            </Button>
          </AccordionTrigger>
          <AccordionContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
            {tasks.length === 0 && (
              <Button
                variant={"ghost"}
                className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
                onClick={() => setShowCreateModal(true)}
              >
                <p>Il n&apos;y a pas encore de tâches</p>
                <span
                  className={cn(
                    "text-sm bg-clip-text text-transparent",
                    CollectionColors[collection.color as CollectionColor]
                  )}
                >
                  Créer
                </span>
              </Button>
            )}
            {tasks.length > 0 && (
              <>
                <Progress className="rounded-none" value={progress} />
                <div className="p-4 gap-3 flex flex-col">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </>
            )}
            <Separator />
            <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center ">
              <p>
                Créée le {collection.createdAt.toLocaleDateString("fr-FR")} à{" "}
                {collection.createdAt.toLocaleTimeString("fr-FR")}
              </p>
              {isLoading && <div>Suppression en cours...</div>}
              {!isLoading && (
                <div className="flex gap-2">
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PlusIcon />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size={"icon"} variant={"ghost"}>
                        <TrashIcon />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogTitle>Êtes-vous sure ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera
                        définitivement votre collection et toutes les tâches
                        qu&apos;elle contient.
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            startTransition(removeCollection);
                          }}
                        >
                          Procéder
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </footer>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

export default CollectionAccordionCard;
