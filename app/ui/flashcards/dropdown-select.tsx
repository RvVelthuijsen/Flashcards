"use client";
import { Category } from "@/app/lib/definitions";
import Image from "next/image";
import plusIcon from "../../../public/plus-icon.svg";
import { useState, useTransition, useRef, RefObject } from "react";
import { KeyboardEvent, MouseEvent } from "react";
import { addCategory } from "@/app/lib/actions";
import { fetchCategories } from "@/app/lib/data";
import { useOutsideClickDetector } from "@/app/lib/utils";

export default function DropDownSelect({
  categories,
  topic,
  setCategories,
}: {
  categories: Category[];
  topic: string;
  setCategories: Function;
}) {
  const [isPending, startTransition] = useTransition();
  const [amendableValues, setValues] = useState({
    dropDownButtonText: "Select a category",
    dropDownInputValue: "",
    newCategoryValue: "",
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

  const createNewCategoryFormData = (
    event: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLImageElement>
  ): FormData => {
    const { key, target } = event as KeyboardEvent<HTMLInputElement>;
    const castTarget = target as HTMLElement;
    const formData = new FormData();

    if (key != "Enter" && castTarget.tagName == "INPUT") return formData;

    event.preventDefault();

    formData.append("title", amendableValues.newCategoryValue);
    setValues({
      ...amendableValues,
      newCategoryValue: "",
    });
    return formData;
  };

  return (
    <>
      <label htmlFor="categories" className="mb-2 block text-sm font-medium">
        Choose category
      </label>

      <div className="relative" ref={ref as RefObject<HTMLDivElement>}>
        <button
          ref={buttonRef}
          id="dropdownDefaultButton"
          className="w-full select-arrow select-arrow-down cursor-pointer rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 placeholder:text-gray-500 text-gray-500 flex justify-between items-center"
          type="button"
          onClick={() => {
            toggleDrowpdown();
          }}
        >
          {amendableValues.dropDownButtonText}
          <input
            readOnly
            name="category-dropdown-input"
            id="category-dropdown-input"
            className="hidden"
            value={amendableValues.dropDownInputValue}
          ></input>
        </button>

        <div
          ref={dropdownRef}
          id="dropdown"
          style={{ zIndex: 9999 }}
          className="hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {categories.map((option) => (
              <li
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                key={option.id}
                onClick={(event) => {
                  const dropDown = document.getElementById("dropdown");
                  const button = document.getElementById(
                    "dropdownDefaultButton"
                  );
                  dropDown?.classList.toggle("hidden");
                  dropDown?.classList.toggle("absolute");
                  button?.classList.toggle("select-arrow-down");
                  button?.classList.toggle("select-arrow-up");
                  setValues({
                    ...amendableValues,
                    dropDownButtonText: option.title,
                    dropDownInputValue: option.title,
                  });
                }}
              >
                {option.title}
              </li>
            ))}
            {isPending && (
              <li
                id="loaderPlaceholder"
                className="relative px-4 py-2 hover:bg-gray-100"
              >
                <p className="loading"></p>
              </li>
            )}

            <li className="relative">
              <Image
                onClick={(event) => {
                  const data = createNewCategoryFormData(event);
                  if (data.get("title")) {
                    startTransition(async () => {
                      const result = await addCategory(data, topic);
                      const newCategories = await fetchCategories(topic);
                      setCategories(newCategories);
                    });
                  }
                }}
                width={16}
                height={16}
                priority={false}
                src={plusIcon}
                alt="Plus icon"
                className="cursor-pointer absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
              />
              <input
                onKeyDown={(event) => {
                  const data = createNewCategoryFormData(event);
                  if (data.get("title")) {
                    startTransition(async () => {
                      const result = addCategory(data, topic);
                      const newCategories = await fetchCategories(topic);
                      setCategories(newCategories);
                    });
                  }
                }}
                className="block w-full pl-4 pr-8 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white "
                type="text"
                name="new-category-input"
                id="new-category-input"
                placeholder="Add new category"
                value={amendableValues.newCategoryValue}
                onChange={(event) =>
                  setValues({
                    ...amendableValues,
                    newCategoryValue: event.target.value,
                  })
                }
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
