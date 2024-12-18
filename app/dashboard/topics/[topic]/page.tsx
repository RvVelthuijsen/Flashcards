import { Metadata } from "next";
import Form from "@/app/ui/flashcards/create-flashcards-form";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/flashcards/flashcards";
import { CardsSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Flashcards",
};

export default async function Page(props: {
  params: Promise<{ topic: string }>;
}) {
  const params = await props.params;
  const topic = params.topic;

  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>Flashcards - {topic}</h1>
      <Form topic={topic} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper topic={topic} />
        </Suspense>
      </div>
    </main>
  );
}
