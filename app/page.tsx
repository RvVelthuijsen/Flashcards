import Image from "next/image";
import { LinkButton } from "./ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="flex self-center text-5xl">Flashcards</h1>
        <p>
          Create flashcards for any topic of your choice and boost your
          learning.
        </p>
        <div className="flex justify-around w-full">
          <LinkButton href="/login" target="_self">
            Login
          </LinkButton>
          <LinkButton href="/register/code" target="_self">
            I have a registration code
          </LinkButton>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/RvVelthuijsen"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github.svg"
            alt="File icon"
            width={16}
            height={16}
            priority={false}
          />
          RvVelthuijsen
        </a>
      </footer>
    </div>
  );
}
