import { Skeleton } from "@/components/ui/skeleton";

export function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[200px] h-[36px]" />
        <Skeleton className="w-[220px] h-[36px] mt-2" />
      </h1>
    </div>
  );
}
