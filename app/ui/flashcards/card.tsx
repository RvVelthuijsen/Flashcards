"use client";
import { useState, useRef, useTransition, useEffect, RefObject } from "react";
import clsx from "clsx";
import { Category, Flashcard } from "@/app/lib/definitions";
import { editFlashcard, deleteFlashcard } from "@/app/lib/actions";
import { fetchFlashcards } from "@/app/lib/data";
import { useOutsideClickDetector } from "@/app/lib/utils";

export function Card({
  editMode,
  card,
  zIndex,
  categories,
  setAllCards,
  flashcards,
  filterTerm,
}: {
  editMode: boolean;
  card: Flashcard;
  zIndex: string;
  categories: Category[];
  setAllCards: Function;
  flashcards: Flashcard[];
  filterTerm: string | null;
}) {
  const [flip, setFlip] = useState(false);
  const [editPending, startEditTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();
  const [showDropDown, setShowDropdown] = useState(false);
  const frontEl = useRef<HTMLDivElement>(null);
  const [tempCard, setTempCard] = useState(card);

  const ref: RefObject<HTMLElement | null> = useOutsideClickDetector(() => {
    if (showDropDown == true) {
      setShowDropdown(false);
    }
  });

  useEffect(() => {
    setTempCard(card);
    setShowDropdown(false);
  }, [flashcards, filterTerm]);

  return (
    <div
      style={{ zIndex: zIndex }}
      className={clsx(
        `flashcard rounded-xl bg-white text-2xl border-4 border-solid border-gray-100 break-all`,
        {
          "flip": flip === true,
        }
      )}
      onClick={() => {
        if (!editMode) {
          setFlip(!flip);
        }
      }}
    >
      {flip ? (
        <div
          style={{ height: frontEl.current?.getBoundingClientRect().height }}
          className="back p-2"
        >
          {card.answer}
        </div>
      ) : (
        <div ref={frontEl} className="front p-2">
          {card.question}
        </div>
      )}
      {editMode && (
        <div>
          {!showDropDown ? (
            <button
              className="absolute right-1 top-1 p-0.5 bg-white border-2 border-solid rounded-full"
              onClick={() => {
                setShowDropdown(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                aria-hidden="true"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="rgb(107 114 128)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
          ) : (
            <div className="absolute right-1 top-1 p-0.5 bg-white border-2 border-solid rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                aria-hidden="true"
                viewBox="0 0 10 6"
                transform="matrix(-1,0,0,-1,0,0)"
              >
                <path
                  stroke="rgb(107 114 128)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </div>
          )}

          {showDropDown && (
            <div
              ref={ref as RefObject<HTMLDivElement>}
              id={`edit-dropdown-${zIndex}`}
              className={clsx(
                "absolute block bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700 left-0 top-6"
              )}
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="edit-dropdown"
              >
                <li className="px-4 py-2 flex flex-row justify-between hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <label htmlFor="categoryOptions" className="hidden">
                    Select category
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-200 py-2 pl-1 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-white dark:bg-gray-600 dark:text-white"
                    name="categoryOptions"
                    id="categoryOptions"
                    defaultValue={
                      tempCard.categories ? tempCard.categories : "null"
                    }
                    onChange={(event) => {
                      setTempCard({
                        ...tempCard,
                        categories: event.target.value,
                      });
                    }}
                  >
                    <option value="null">Select category</option>
                    {categories.map((category) => (
                      <option value={category.title} key={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </li>
                <li className="px-4 gap-1 py-2 flex flex-row justify-between hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <label htmlFor="question-input" className="hidden">
                    Edit question
                  </label>
                  <input
                    id="question-input"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-white dark:bg-gray-600 dark:text-white"
                    type="text"
                    value={tempCard.question}
                    onChange={(event) => {
                      setTempCard({
                        ...tempCard,
                        question: event.target.value,
                      });
                    }}
                  />
                </li>
                <li className="px-4 gap-1 py-2 flex flex-row justify-between hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  <label htmlFor="answer-input" className="hidden">
                    Edit answer
                  </label>
                  <input
                    id="answer-input"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-white dark:bg-gray-600 dark:text-white"
                    type="text"
                    value={tempCard.answer}
                    onChange={(event) => {
                      setTempCard({ ...tempCard, answer: event.target.value });
                    }}
                  />
                </li>
                <li className="px-4 gap-1 py-2 flex flex-row justify-between">
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      if (
                        card.answer != tempCard.answer ||
                        card.question != tempCard.question ||
                        card.categories != tempCard.categories
                      ) {
                        startEditTransition(async () => {
                          const result = await editFlashcard(tempCard);
                        });
                      }
                    }}
                    className="flex items-center rounded-lg bg-blue-500 px-2 py-2 text-sm text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                  >
                    {editPending ? (
                      <div className="loader"></div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      startDeleteTransition(async () => {
                        const result = await deleteFlashcard(tempCard);
                        const newCards = await fetchFlashcards(tempCard.topic);
                        setAllCards(newCards);
                        setShowDropdown(false);
                      });
                    }}
                    className="flex items-center rounded-lg bg-red-500 px-2 py-2 text-sm text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 active:bg-red-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                  >
                    {deletePending ? (
                      <div className="loader"></div>
                    ) : (
                      "Delete flashcard"
                    )}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
