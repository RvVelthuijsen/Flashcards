"use client";

import FlashcardWrapper from "@/app/ui/flashcards/flashcards";
import DropDownFilter from "@/app/ui/flashcards/dropdown-filter";
import { Category, Flashcard } from "@/app/lib/definitions";
import { useState } from "react";
import Form from "@/app/ui/flashcards/create-flashcards-form";
import DropDownSelect from "@/app/ui/flashcards/dropdown-select";

export default function FlashcardSection({
  flashcards,
  categories,
  topic,
}: {
  flashcards: Flashcard[];
  categories: Category[];
  topic: string;
}) {
  const [cats, setCats] = useState(categories);
  const [allCards, setAllCards] = useState(flashcards);
  const [filteredCards, setFilteredCards] = useState(flashcards);
  const [editMode, setEditingMode] = useState(false);
  return (
    <>
      <Form topic={topic}>
        <DropDownSelect
          categories={cats}
          topic={topic}
          setCategories={setCats}
        />
      </Form>
      <div>
        <div
          style={{ zIndex: 8888, top: "-48px" }}
          className=" sticky bg-white flex justify-around w-full items-center pt-1 gap-4 mb-8"
        >
          <DropDownFilter
            categories={cats}
            flashcards={allCards}
            setFilteredCards={setFilteredCards}
          />
          <div className="w-full flex flex-col justify-end items-end">
            <p className="invisible">­</p>
            <button
              className="cursor-pointer rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 text-gray-500 flex justify-between items-center"
              onClick={() => setEditingMode(!editMode)}
            >
              Edit Cards
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto">
          <FlashcardWrapper
            flashcards={allCards}
            setAllFlashcards={setAllCards}
            filteredCards={filteredCards}
            setFilteredCards={setFilteredCards}
            editMode={editMode}
            categories={cats}
          />
        </div>
      </div>
    </>
  );
}
