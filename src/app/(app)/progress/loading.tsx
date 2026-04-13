import { ProgressSkeleton } from "@/components/skeletons/progress-skeleton";

export default function ProgressLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <div className="h-8 w-28 animate-pulse rounded bg-surface" />
        <div className="h-7 w-24 animate-pulse rounded-[20px] bg-surface" />
      </div>
      <ProgressSkeleton />
    </div>
  );
}
