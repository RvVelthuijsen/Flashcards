"use client";
import { Category } from "@/app/lib/definitions";
import { useState, useRef, RefObject } from "react";
import { useOutsideClickDetector } from "@/app/lib/utils";

export default function DropDownFilter({
  categories,
  setFilterTerm,
}: {
  categories: Category[];
  setFilterTerm: Function;
}) {
  const [amendableValues, setValues] = useState({
    dropDownButtonText: "Categories",
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDrowpdown = () => {
    const self = buttonRef.current as HTMLButtonElement;
    const dropDown = dropdownRef.current as HTMLDivElement;
    dropDown?.classList.toggle("hidden");
    dropDown?.classList.toggle("absolute");
    self?.classList.toggle("select-arrow-down");
    self?.classList.toggle("select-arrow-up");
  };

  const hideDrowpdown = () => {
    const dropDown = dropdownRef.current as HTMLDivElement;
    if (!dropDown.classList.contains("hidden")) {
      toggleDrowpdown();
    }
  };

  const ref: RefObject<HTMLElement | null> = useOutsideClickDetector(() =>
    hideDrowpdown()
  );

  const selectFilterTerm = (option: string | null) => {
    toggleDrowpdown();
    setFilterTerm(option);
    setValues({ dropDownButtonText: option == null ? "No category" : option });
  };

  return (
    <div className="w-full">
      <label htmlFor="categories" className="mb-2 block text-sm font-medium">
        Filter by category
      </label>

      <div className="relative" ref={ref as RefObject<HTMLDivElement>}>
        <button
          ref={buttonRef}
          id="filter-dropdown-button"
          className="w-full select-arrow select-arrow-down cursor-pointer rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 placeholder:text-gray-500 text-gray-500 flex justify-between items-center"
          type="button"
          onClick={() => {
            toggleDrowpdown();
          }}
        >
          {amendableValues.dropDownButtonText}
        </button>

        <div
          ref={dropdownRef}
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
                selectFilterTerm("All");
              }}
            >
              All
            </li>
            {categories.map((option) => (
              <li
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                key={option.id}
                onClick={() => {
                  selectFilterTerm(option.title);
                }}
              >
                {option.title}
              </li>
            ))}
            <li
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => {
                selectFilterTerm(null);
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
