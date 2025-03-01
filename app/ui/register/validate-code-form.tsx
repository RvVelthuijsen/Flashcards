"use client";

import { Button } from "@/app/ui/button";
import { useActionState } from "react";
import { validateCode } from "@/app/lib/actions";

export default function VaidateCodeForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    validateCode,
    undefined
  );
  return (
    <form action={formAction} className="flex w-full flex-col">
      <label htmlFor="code-input" className="mb-3 mt-5 text-gray-900">
        Enter code
      </label>

      <input
        type="text"
        id="code-input"
        name="code"
        className="w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
      />
      <Button className="mt-4 w-full" aria-disabled={isPending}>
        Validate
      </Button>
      <div className="flex h-8 items-end space-x-1">
        {errorMessage && (
          <>
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        )}
      </div>
    </form>
  );
}
