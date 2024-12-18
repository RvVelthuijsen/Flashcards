import { fetchFlashcards } from "@/app/lib/data";
import { Flashcard } from "@/app/lib/definitions";
import { Card } from "./card";

export default async function CardWrapper({ topic }: { topic: string }) {
  const flashcards = await fetchFlashcards(topic);
  return (
    <>
      {flashcards.map((flashcard: Flashcard, index: Number) => (
        <Card
          question={flashcard.question}
          answer={flashcard.answer}
          key={index.toString()}
        />
      ))}
    </>
  );
}
