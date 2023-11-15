import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { useForm } from "react-hook-form";
import {
  createCollectionSchema,
  createCollectionSchemaType,
} from "@/schema/createCollection";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createCollection } from "@/actions/collection";
import { toast } from "./ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateCollectionSheet({ open, onOpenChange }: Props) {
  const form = useForm<createCollectionSchemaType>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {},
  });

  const router = useRouter();

  const onSubmit = async (data: createCollectionSchemaType) => {
    try {
      await createCollection(data);

      // Close the sheet
      openChangeWrapper(false);
      router.refresh();

      toast({
        title: "Succès",
        description: "La collection a été créé avec succès",
      });
    } catch (e: any) {
      // Show toast
      toast({
        title: "Erreur",
        description: "une erreur s'est produit, veuillez réessayer plus tard",
        variant: "destructive",
      });
      console.log("Error while creating collection", e);
    }
  };

  const openChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ajouter une nouvelle collection</SheetTitle>
          <SheetDescription>
            Les collections sont un moyen de regrouper vos tâches
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Personnel" {...field} />
                  </FormControl>
                  <FormDescription>Nom de la collection</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={cn(
                          "w-full h-8 text-white",
                          CollectionColors[field.value as CollectionColor]
                        )}
                      >
                        <SelectValue
                          placeholder="Couleur"
                          className="w-full h-8"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.keys(CollectionColors).map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className={cn(
                              `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-8 transition-[padding]`,
                              {
                                "bg-gradient-to-r from-red-500 to-orange-500":
                                  color == "sunset",
                                "bg-gradient-to-r from-rose-400 to-red-500":
                                  color == "poppy",
                                "bg-gradient-to-r from-violet-500 to-purple-500":
                                  color == "rosebud",
                                "bg-gradient-to-r from-indigo-400 to-cyan-400":
                                  color == "snowflake",
                                "bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500":
                                  color == "candy",
                                "bg-gradient-to-r from-emerald-500 to-emerald-900":
                                  color == "firtree",
                                "bg-gradient-to-r from-slate-500 to-slate-800":
                                  color == "metal",
                                "bg-gradient-to-r from-violet-200 to-pink-200":
                                  color == "powder",
                              }
                            )}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Selectionner une couleur pour votre collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex flex-col gap-3 mt-4">
          <Separator />
          <Button
            disabled={form.formState.isSubmitting}
            variant={"outline"}
            className={cn(
              form.watch("color") &&
                CollectionColors[form.getValues("color") as CollectionColor]
            )}
            onClick={form.handleSubmit(onSubmit)}
          >
            Confirmer
            {form.formState.isSubmitting && (
              <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateCollectionSheet;
