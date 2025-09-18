import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="border rounded-md">
            <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </DashboardLayout>
  );
}
