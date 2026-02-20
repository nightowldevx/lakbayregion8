import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <>
            {/* Skeleton hero */}
            <Skeleton className="h-[70vh] w-full rounded-none" />

            {/* Stats bar */}
            <div className="flex items-center justify-center gap-8 border-b border-gray-100 bg-white px-4 py-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="h-8 w-10" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>

            {/* Grid section */}
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                {/* Section heading */}
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-36" />
                </div>

                {/* Search + filter bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Skeleton className="h-10 w-full max-w-lg" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-6 w-20 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* 6 skeleton cards matching DestinationCard dimensions */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                            {/* Image area — h-48 matches DestinationCard */}
                            <Skeleton className="h-48 w-full rounded-none" />
                            {/* Content area */}
                            <div className="space-y-2 p-4">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
