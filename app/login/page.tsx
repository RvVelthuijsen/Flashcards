import LoginForm from "@/app/ui/login-form";
import { Metadata } from "next";
import logo from "@/public/flashcards-logo.svg";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col justify-center items-center space-y-2.5 p-4 md:-mt-32">
        <Image priority src={logo} alt="Flashcards logo"></Image>
        <LoginForm />
      </div>
    </main>
  );
}
