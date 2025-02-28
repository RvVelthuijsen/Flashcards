"use client";

import { useState, useTransition } from "react";
import { Topic, Category, Flashcard } from "@/app/lib/definitions";
import DropdownBasic from "@/app/ui/components/dropdown-basic";
import {
  fetchCategories,
  fetchFilteredFlashcards,
  fetchFlashcards,
} from "@/app/lib/data";

interface CategoryObject {
  [key: string]: Category[];
}

export default function PracticeSelection({
  setPracticeActive,
  topics,
  setCards,
  setSelectedMode,
  selectedMode,
}: {
  setPracticeActive: Function;
  topics: Topic[];
  setCards: Function;
  setSelectedMode: Function;
  selectedMode: any;
}) {
  const [selectedTopic, setSelectedTopic] = useState<Topic>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [categories, setCategories] = useState<CategoryObject>({});
  const [isCallbackPending, startCallbackTransition] = useTransition();
  const [isPracticePending, startPracticeTransition] = useTransition();

  const categoryCallback = (selected: Topic) => {
    setSelectedTopic(selected);
    if (!(selected.title in categories)) {
      startCallbackTransition(async () => {
        let cats: Category[] = await fetchCategories(selected.title);
        setCategories({ ...categories, [selected.title]: [...cats] });
      });
    }
  };

  return (
    <div className="flex mb-2 w-full justify-between px-3 py-4 md:px-2 bg-gray-50">
      <div className="flex w-[70%] flex-col md:flex-row">
        <DropdownBasic
          itemsToRender={topics}
          renderBookends={false}
          callback={categoryCallback}
          label="topic"
        />
        <DropdownBasic
          itemsToRender={[
            { id: 1, title: "question > answer" },
            { id: 2, title: "answer > question" },
          ]}
          renderBookends={false}
          callback={setSelectedMode}
          label="mode"
        />
        {isCallbackPending && (
          <div className=" md:w-[33%] h-full flex items-center justify-center ">
            <div className="loader"></div>
          </div>
        )}
        {categories &&
          selectedTopic?.title &&
          categories[selectedTopic?.title] &&
          categories[selectedTopic?.title].length > 0 && (
            <DropdownBasic
              itemsToRender={categories[selectedTopic?.title]}
              renderBookends={true}
              callback={setSelectedCategory}
              label="category"
            />
          )}
      </div>
      <div className="flex justify-center items-end w-[30%]">
        <button
          className="cursor-pointer bg-white rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 text-gray-500 flex justify-between items-center"
          onClick={() => {
            if (selectedTopic && selectedCategory && selectedMode) {
              setPracticeActive(true);
              startPracticeTransition(async () => {
                let tempCards: Flashcard[] = [];
                if (selectedCategory.title == "All") {
                  tempCards = await fetchFlashcards(selectedTopic?.title);
                } else {
                  tempCards = await fetchFilteredFlashcards(
                    selectedTopic?.title,
                    selectedCategory.title
                  );
                  console.log(tempCards);
                }
                setCards(tempCards);
              });
            }
          }}
        >
          {isPracticePending ? (
            <div className="loader"></div>
          ) : (
            "► Start Practice"
          )}
        </button>
      </div>
    </div>
  );
}
