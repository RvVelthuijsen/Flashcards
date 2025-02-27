"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import flashcardLogo from "../../../public/flashcards-logo.svg";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Topics", href: "/dashboard/topics" },
  { name: "Practice", href: "/dashboard/practice" },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      <Link key="Home" href="/dashboard" className="flex w-full justify-center">
        <Image
          width={100}
          height={100}
          priority={false}
          src={flashcardLogo}
          alt="Plus icon"
        ></Image>
      </Link>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
