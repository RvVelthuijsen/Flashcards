import { Metadata } from "next";

import ValidateCodeForm from "@/app/ui/register/validate-code-form";

export const metadata: Metadata = {
  title: "Register - Code",
};

export default function RegisterCodePage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex items-center justify-center h-20 w-full rounded-lg bg-blue-500 p-3 md:h-36">
          <h1 className="flex text-5xl  text-white">Flashcards</h1>
        </div>
        <ValidateCodeForm />
      </div>
    </main>
  );
}
