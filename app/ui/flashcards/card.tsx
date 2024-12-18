"use client";
import { useState } from "react";
import clsx from "clsx";

export function Card({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [flip, setFlip] = useState(false);
  return (
    <div
      className=" rounded-xl bg-gray-50 p-2 shadow-sm"
      onClick={() => {
        console.log("hello");
        setFlip(!flip);
        console.log(flip);
      }}
    >
      <div
        className={clsx(`flashcard rounded-xl bg-white px-4 py-8 text-2xl`, {
          "flip": flip === true,
        })}
      >
        <div
          className={clsx("front", {
            "hidden": flip === true,
          })}
        >
          {question}
        </div>
        <div className="back">{answer} </div>
      </div>
    </div>
  );
}
