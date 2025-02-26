"use client";
import { Category, Flashcard } from "@/app/lib/definitions";
import { useState } from "react";

export default function DropDownFilter({
  categories,
  setFilteredCards,
  flashcards,
}: {
  categories: Category[];
  setFilteredCards: Function;
  flashcards: Flashcard[];
}) {
  const [amendableValues, setValues] = useState({
    dropDownButtonText: "Categories",
  });

  const filterCards = (option: string | null) => {
    const dropDown = document.getElementById("filter-dropdown");
    const button = document.getElementById("filter-dropdown-button");
    dropDown?.classList.toggle("hidden");
    dropDown?.classList.toggle("absolute");
    button?.classList.toggle("select-arrow-down");
    button?.classList.toggle("select-arrow-up");
    const filtered =
      option == "All"
        ? flashcards
        : flashcards.filter((card) => card.categories == option);
    setFilteredCards(filtered);
    setValues({ dropDownButtonText: option == null ? "No category" : option });
  };

  return (
    <div className="w-full">
      <label htmlFor="categories" className="mb-2 block text-sm font-medium">
        Filter by category
      </label>

      <div className="relative">
        <button
          id="filter-dropdown-button"
          className="w-full select-arrow select-arrow-down cursor-pointer rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 placeholder:text-gray-500 text-gray-500 flex justify-between items-center"
          type="button"
          onClick={(event) => {
            const self = event.target as HTMLButtonElement;
            const dropDown = document.getElementById("filter-dropdown");
            dropDown?.classList.toggle("hidden");
            dropDown?.classList.toggle("absolute");
            self?.classList.toggle("select-arrow-down");
            self?.classList.toggle("select-arrow-up");
          }}
        >
          {amendableValues.dropDownButtonText}
        </button>

        <div
          style={{ zIndex: 9999 }}
          id="filter-dropdown"
          className="hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="filter-dropdown-button"
          >
            <li
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                filterCards("All");
              }}
            >
              All
            </li>
            {categories.map((option) => (
              <li
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                key={option.id}
                onClick={() => {
                  filterCards(option.title);
                }}
              >
                {option.title}
              </li>
            ))}
            <li
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                filterCards(null);
              }}
            >
              No category
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
