import { Metadata } from "next";
import { Suspense } from "react";
import { fetchTopics } from "@/app/lib/data";
import { Topic } from "@/app/lib/definitions";
import PracticeSection from "@/app/ui/practice/practice-section";

export const metadata: Metadata = {
  title: "Practice",
};

export default async function Page() {
  const topics: Topic[] = await fetchTopics();
  return (
    <main className="h-full">
      <h1 className={`mb-4 text-xl md:text-2xl`}>Practice</h1>
      <div className="h-full">
        <Suspense>
          <PracticeSection topics={topics} />
        </Suspense>
      </div>
    </main>
  );
}
