"use client";

import { Button } from "@/app/ui/button";
import { addTopic, TopicState } from "@/app/lib/actions";
import { useActionState } from "react";

export default function Form() {
  const initialState: TopicState = { message: null, errors: {} };
  const [state, formAction] = useActionState(addTopic, initialState);
  return (
    <form action={formAction} className="mb-4">
      <div className="rounded-md bg-gray-50 p-4 md:p-6 ">
        <label htmlFor="topic" className="mb-2 block text-sm font-medium">
          Add a topic
        </label>
        <div className="flex justify-between items-center">
          <div className="w-full">
            <div className="relative rounded-md">
              <div className="relative">
                <input
                  id="title"
                  name="title"
                  placeholder="Enter topic title"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="title-error"
                />
              </div>
            </div>
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors.title.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="ml-4 min-w-28 flex justify-center items-center">
            <Button type="submit">Add Topic</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
