import { Metadata } from "next";

import ValidateCodeForm from "@/app/ui/register/validate-code-form";
import logo from "@/public/flashcards-logo.svg";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register - Code",
};

export default function RegisterCodePage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col justify-center items-center space-y-2.5 p-4 md:-mt-32">
        <Image priority src={logo} alt="Flashcards logo"></Image>
        <ValidateCodeForm />
      </div>
    </main>
  );
}
