"use client";
import { Task } from "@prisma/client";
import React, { useState, useTransition } from "react";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { deleteTask, editTask } from "@/actions/task";
import { useRouter } from "next/navigation";
import { CheckedState } from "@radix-ui/react-checkbox";
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
import { Button } from "./ui/button";
import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import { toast } from "./ui/use-toast";
import UpdateTaskDialog from "./UpdateTaskDialog";

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;

  if (days < 0) return "text-gray-300 dark:text-gray-400";

  if (days <= 3 * 24) return "text-red-500 dark:text-red-400";
  if (days <= 7 * 24) return "text-orange-500 dark:text-orange-400";
  return "text-green-500 dark:text-green-400";
}

function TaskCard({ task }: { task: Task }) {
  const [isLoading, startTransition] = useTransition();
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const removeTask = async () => {
    try {
      await deleteTask(task.id);
      toast({
        title: "Succès",
        description: "La tâche a été supprimé avec succès",
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <UpdateTaskDialog
        open={showEditModal}
        setOpen={setShowEditModal}
        task={task}
      />
      <div className="flex justify-between">
        <div className="flex gap-2 items-start">
          <Checkbox
            id={task.id.toString()}
            className="w-5 h-5"
            checked={task.done}
            disabled={isLoading}
            onCheckedChange={(checked: CheckedState) => {
              startTransition(async () => {
                if (typeof checked == "boolean") {
                  await editTask(task.id, checked);
                  router.refresh();
                }
              });
            }}
          />
          <label
            htmlFor={task.id.toString()}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white",
              task.done && "line-through"
            )}
          >
            {task.content}
            {task.expiresAt && (
              <p
                className={cn(
                  "text-xs text-neutral-500 dark:text-neutral-400",
                  getExpirationColor(task.expiresAt)
                )}
              >
                {format(task.expiresAt, "dd/MM/yyyy")}
              </p>
            )}
          </label>
        </div>

        {!isLoading && (
          <div className="flex gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setShowEditModal(true)}
            >
              <GearIcon />
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
                  définitivement la tâche.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      startTransition(removeTask);
                    }}
                  >
                    Procéder
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </>
  );
}

export default TaskCard;
