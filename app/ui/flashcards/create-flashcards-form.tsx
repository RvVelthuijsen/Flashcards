"use client";

import { Button } from "@/app/ui/button";
import { addFlashcard, FlashcardState } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form({ topic }: { topic: string }) {
  const initialState: FlashcardState = { message: null, errors: {} };
  const [state, formAction] = useActionState(addFlashcard, initialState);
  return (
    <form action={formAction} className="mb-4">
      <div className="rounded-md bg-gray-50 p-4 md:p-6 flex justify-around items-center">
        <div className="flex justify-between items-center w-full mr-2">
          <div className="w-full">
            <label
              htmlFor="question"
              className="mb-2 block text-sm font-medium"
            >
              Add a question
            </label>
            <div className="relative rounded-md">
              <div className="relative">
                <input
                  id="question"
                  name="question"
                  placeholder="Enter flashcard question"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="question-error"
                />
              </div>
            </div>
            <div id="question-error" aria-live="polite" aria-atomic="true">
              {state.errors?.question &&
                state.errors.question.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="w-full">
            <label
              htmlFor="question"
              className="mb-2 block text-sm font-medium"
            >
              Add an answer
            </label>
            <div className="relative rounded-md">
              <div className="relative">
                <input
                  id="answer"
                  name="answer"
                  placeholder="Enter flashcard answer"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="answer-error"
                />
              </div>
            </div>
            <div id="answer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.answer &&
                state.errors.answer.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="justify-between items-center hidden">
          <div className="w-full">
            <label htmlFor="topic" className="mb-2 block text-sm font-medium">
              Topic
            </label>
            <div className="relative rounded-md">
              <div className="relative">
                <input
                  id="topic"
                  name="topic"
                  value={topic || ""}
                  readOnly
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="answer-error"
                />
              </div>
            </div>
            <div id="answer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.answer &&
                state.errors.answer.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="ml-4 min-w-28 flex justify-center items-center">
          <Button type="submit">Add Flashcard</Button>
        </div>
      </div>
    </form>
  );
}
