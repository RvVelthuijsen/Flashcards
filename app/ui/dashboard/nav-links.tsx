"use client";

import Link from "next/link";
import { usePathname, redirect } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import flashcardLogo from "../../../public/flashcards-logo.svg";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Topics", href: "/dashboard/topics" },
  { name: "Practice", href: "/dashboard/practice" },
];

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  if (pathname.endsWith("login")) {
    redirect("/dashboard");
  }
  return (
    <>
      <Link
        key="Home"
        href="/dashboard"
        className="flex w-full justify-center "
      >
        <Image
          width={100}
          style={{ height: "auto" }}
          priority
          src={flashcardLogo}
          alt="Flashcards logo"
        ></Image>
      </Link>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200 hover:text-gray-800 md:flex-none md:justify-start md:p-2 md:px-3 ",
              {
                "bg-sky-100 text-gray-800": pathname === link.href,
              }
            )}
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href={"/dashboard/admin"}
          className={clsx(
            "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200 hover:text-gray-800 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "bg-sky-100 text-gray-800": pathname === "/dashboard/admin",
            }
          )}
        >
          <p>Admin</p>
        </Link>
      )}
    </>
  );
}
