import { Category, Flashcard } from "@/app/lib/definitions";
import { Card } from "./card";
import { useEffect } from "react";

export default function FlashcardWrapper({
  flashcards,
  setFilteredCards,
  setAllFlashcards,
  editMode,
  categories,
  filteredCards,
}: {
  flashcards: Flashcard[];
  filteredCards: Flashcard[];
  setFilteredCards: Function;
  setAllFlashcards: Function;
  editMode: boolean;
  categories: Category[];
}) {
  let length = flashcards.length;

  useEffect(() => {
    setFilteredCards(flashcards);
  }, [flashcards]);

  return (
    <>
      {filteredCards.map((flashcard: Flashcard, index: number) => {
        let key = length - index;
        return (
          <Card
            categories={categories}
            card={flashcard}
            setAllCards={setAllFlashcards}
            filteredCards={filteredCards}
            key={index.toString()}
            zIndex={key.toString()}
            editMode={editMode}
          />
        );
      })}
    </>
  );
}
