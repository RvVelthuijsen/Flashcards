"use client";
import { useState, useRef } from "react";
import clsx from "clsx";

export function Card({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [flip, setFlip] = useState(false);
  const frontEl = useRef<HTMLDivElement>(null);

  return (
    <div
      className={clsx(
        `flashcard rounded-xl bg-white text-2xl border-4 border-solid border-gray-100`,
        {
          "flip": flip === true,
        }
      )}
      onClick={() => {
        setFlip(!flip);
      }}
    >
      {flip ? (
        <div
          style={{ height: frontEl.current?.getBoundingClientRect().height }}
          className="back p-2"
        >
          {answer}
        </div>
      ) : (
        <div ref={frontEl} className="front p-2">
          {question}
        </div>
      )}
    </div>
  );
}
