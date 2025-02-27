import { Metadata } from "next";
import { Suspense } from "react";
import { fetchTopics } from "@/app/lib/data";
import { Topic } from "@/app/lib/definitions";

export const metadata: Metadata = {
  title: "Practice",
};

export default async function Page() {
  // const topics: Topic[] = await fetchTopics();
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>Practice</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"></div>
    </main>
  );
}
