import { Flashcard } from "@/app/lib/definitions";
import { useState, KeyboardEvent, MouseEvent, useRef } from "react";
import Image from "next/image";
import plusIcon from "@/public/plus-icon.svg";

export default function PracticeCard({
  card,
  index,
  activeCardCallback,
  mode,
}: {
  card: Flashcard;
  index: number;
  activeCardCallback: Function;
  mode: number;
}) {
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkAnswer = (
    event: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLImageElement>
  ) => {
    const { key, target } = event as KeyboardEvent<HTMLInputElement>;
    const castTarget = target as HTMLElement;

    if (key != "Enter" && castTarget.tagName == "INPUT") return;

    if (userAnswer === (mode === 1 ? card.answer : card.question)) {
      setIsCorrect(true);
      setTimeout(() => {
        activeCardCallback(index);
      }, 500);
    } else {
      const input = inputRef.current as HTMLInputElement;
      input.classList.add("shake");
      setTimeout(() => {
        input.classList.remove("shake");
      }, 500);
    }
  };
  return (
    <div className="flashcard flex flex-col gap-2 justify-center items-center rounded-xl bg-white text-2xl border-4 border-solid border-gray-100 break-all p-2">
      {!isCorrect && (
        <>
          <p>{mode === 1 ? card.question : card.answer}</p>
          <div className="relative">
            {!showAnswer && (
              <>
                <Image
                  onClick={(event) => {
                    checkAnswer(event);
                  }}
                  width={16}
                  height={16}
                  priority={false}
                  src={plusIcon}
                  alt="Plus icon"
                  className="cursor-pointer absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"
                />

                <input
                  autoFocus
                  autoComplete="off"
                  ref={inputRef}
                  onKeyDown={(event) => {
                    checkAnswer(event);
                  }}
                  className="block w-full pl-4 pr-8 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white "
                  type="text"
                  name="new-category-input"
                  id="new-category-input"
                  placeholder="answer..."
                  value={userAnswer}
                  onChange={(event) => setUserAnswer(event.target.value)}
                />
              </>
            )}
          </div>
          {showAnswer && (
            <p
              className="flex justify-center"
              style={{
                width: inputRef.current?.getBoundingClientRect().width,
                height: inputRef.current?.getBoundingClientRect().height,
              }}
            >
              {mode === 1 ? card.answer : card.question}
            </p>
          )}

          <button
            className="cursor-pointer bg-white rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 text-gray-500 flex justify-between items-center"
            onClick={() => {
              setShowAnswer(true);
              setTimeout(() => {
                activeCardCallback(index);
              }, 2000);
            }}
          >
            skip
          </button>
        </>
      )}
      {isCorrect && <p>✅</p>}
    </div>
  );
}
