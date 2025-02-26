import { Metadata } from "next";
import { Suspense } from "react";
import { fetchFlashcards, fetchCategories } from "@/app/lib/data";
import FlashcardSection from "@/app/ui/flashcards/flashcard-section";
import { CardsSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Flashcards",
};

export default async function Page(props: {
  params: Promise<{ topic: string }>;
}) {
  const params = await props.params;
  const topic = decodeURIComponent(params.topic);
  const flashcards = await fetchFlashcards(topic);
  const categories = await fetchCategories(topic);

  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>Flashcards - {topic}</h1>
      <Suspense fallback={<CardsSkeleton />}>
        <FlashcardSection
          flashcards={flashcards}
          categories={categories}
          topic={topic}
        />
      </Suspense>
    </main>
  );
}
