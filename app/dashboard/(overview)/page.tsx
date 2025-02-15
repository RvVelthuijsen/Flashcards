import { Suspense } from "react";
import TopicCardWrapper from "@/app/ui/dashboard/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { fetchMostRecentTopics } from "@/app/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flashcards",
};

export default async function Page() {
  const recentTopics = await fetchMostRecentTopics();
  return (
    <main>
      <h1 className="mb-8 text-xl md:text-2xl">Flashcards</h1>
      <h2 className="mb-8 text-l md:text-xl">
        Recently viewed flashcard topics:
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <TopicCardWrapper topics={recentTopics} />
        </Suspense>
      </div>
      <h2 className="my-8 text-l md:text-xl">Go to:</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/dashboard/topics`}>
          <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <h3 className="ml-2 text-sm font-medium">All Topics</h3>
          </div>
        </Link>
      </div>
    </main>
  );
}
