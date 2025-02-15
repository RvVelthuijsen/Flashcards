import { Metadata } from "next";
import { Suspense } from "react";
import TopicCardWrapper from "@/app/ui/dashboard/cards";
import { CardsSkeleton } from "@/app/ui/skeletons";
import Form from "@/app/ui/topics/create-topic-form";
import { fetchTopics } from "@/app/lib/data";
import { Topic } from "@/app/lib/definitions";

export const metadata: Metadata = {
  title: "Topics",
};

export default async function Page() {
  const topics: Topic[] = await fetchTopics();
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>Topics</h1>
      <Form />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <TopicCardWrapper topics={topics} />
        </Suspense>
      </div>
    </main>
  );
}
