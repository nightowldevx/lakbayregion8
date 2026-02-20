import { Skeleton } from '@/components/ui/skeleton';

export default function MapLoading() {
    return (
        <div className="h-[calc(100vh-64px)] w-full relative">
            {/* Full-height pulsing map placeholder */}
            <Skeleton className="h-full w-full rounded-none" />

            {/* Trigger button placeholder */}
            <div className="absolute bottom-6 left-4 sm:top-1/2 sm:bottom-auto sm:left-4">
                <Skeleton className="h-9 w-36 rounded-md" />
            </div>

            {/* Navigation controls placeholder */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
        </div>
    );
}
