import { Category, Flashcard } from "@/app/lib/definitions";
import { Card } from "./card";

export default function FlashcardWrapper({
  flashcards,
  setAllFlashcards,
  editMode,
  categories,
  filterTerm,
}: {
  flashcards: Flashcard[];
  setAllFlashcards: Function;
  editMode: boolean;
  categories: Category[];
  filterTerm: string | null;
}) {
  let length = flashcards.length;

  return (
    <>
      {flashcards
        .filter((card) => {
          if (filterTerm != "All") {
            return card.categories == filterTerm;
          } else {
            return true;
          }
        })
        .map((flashcard: Flashcard, index: number) => {
          let key = length - index;
          return (
            <Card
              categories={categories}
              card={flashcard}
              setAllCards={setAllFlashcards}
              flashcards={flashcards}
              key={index.toString()}
              zIndex={key.toString()}
              editMode={editMode}
              filterTerm={filterTerm}
            />
          );
        })}
    </>
  );
}
