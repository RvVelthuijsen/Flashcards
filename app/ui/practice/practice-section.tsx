"use client";

import { useState } from "react";
import PracticeSelection from "./pratice-selection";
import { Flashcard, Topic } from "@/app/lib/definitions";
import PracticeCard from "./card";
import clsx from "clsx";

export default function PracticeSection({ topics }: { topics: Topic[] }) {
  const [practiceActive, setPracticeActive] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [activeCard, setActiveCard] = useState<Flashcard>();
  const [selectedMode, setSelectedMode] = useState({
    id: 1,
    title: "answer > question",
  });

  function shuffleArray(array: Flashcard[]) {
    let tempArray = array.slice();
    for (let i = tempArray.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }
    return tempArray;
  }

  const cardCallback = (cards: Flashcard[]) => {
    const shuffled = shuffleArray(cards);
    setCards(shuffled);
    setActiveCard(shuffled[0]);
    setCardsReady(true);
  };

  const activeCardCallback = (index: number) => {
    if (index + 1 != cards?.length) {
      setActiveCard(cards[index + 1]);
    } else {
      setPracticeActive(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={clsx("flex", {
          "hidden": practiceActive,
        })}
      >
        <PracticeSelection
          topics={topics}
          setPracticeActive={setPracticeActive}
          setCards={cardCallback}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
        />
      </div>
      {practiceActive && (
        <div className="h-full">
          <button
            className="cursor-pointer bg-white rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 text-gray-500 flex justify-between items-center"
            onClick={() => {
              setPracticeActive(false);
              setCardsReady(false);
            }}
          >
            Stop Practice
          </button>
          <div className="flex w-full h-[80%] items-center justify-center">
            {cards &&
              cardsReady &&
              cards.map(
                (card, index) =>
                  activeCard == card && (
                    <PracticeCard
                      key={card.id}
                      card={card}
                      index={index}
                      activeCardCallback={activeCardCallback}
                      mode={selectedMode.id}
                    />
                  )
              )}
          </div>
        </div>
      )}
    </div>
  );
}
