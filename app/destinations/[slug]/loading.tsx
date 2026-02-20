import { Skeleton } from '@/components/ui/skeleton';

export default function DestinationLoading() {
    return (
        <main className="min-h-screen">
            {/* Hero skeleton — aspect-video matches the real hero */}
            <Skeleton className="w-full aspect-video rounded-none" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-10">

                    {/* ── Main content (2/3) ── */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* About section */}
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>

                        {/* Gallery skeleton — masonry-style: first large, three small */}
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-20" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <Skeleton className="col-span-2 md:col-span-2 h-64 md:h-80 rounded-lg" />
                                <Skeleton className="h-40 md:h-auto rounded-lg" />
                                <Skeleton className="h-40 md:h-auto rounded-lg" />
                                <Skeleton className="h-40 md:h-auto rounded-lg" />
                            </div>
                        </div>

                        {/* Travel tips skeleton */}
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-32" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                        </div>

                        {/* Map embed skeleton */}
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="aspect-video w-full rounded-xl" />
                        </div>
                    </div>

                    {/* ── Info card (1/3) ── */}
                    <div className="mt-10 lg:mt-0">
                        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-md space-y-5 dark:bg-gray-800 dark:border-gray-700">
                            <Skeleton className="h-5 w-36" />
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="size-5 shrink-0 rounded-sm mt-0.5" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>
                </div>

                {/* Related destinations */}
                <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800 space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                <Skeleton className="h-48 w-full rounded-none" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
