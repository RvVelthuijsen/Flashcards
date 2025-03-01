"use client";

import { registerUser } from "@/app/lib/actions";
import { redirect, usePathname } from "next/navigation";
import bcrypt from "bcryptjs";

export default function RegisterForm() {
  if (usePathname().endsWith("code")) {
    redirect("/register");
  }
  return (
    <div id="whet" className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
      <h1 className="mb-3 text-2xl">Register to continue.</h1>
      <div className="w-full mb-3">
        <div className="mt-4">
          <form id="register" className="flex w-full flex-col">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="name"
              >
                Name
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                  id="name"
                  type="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4
                 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <button
        className="flex mt-4 w-full h-10 items-center rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        onClick={async (event) => {
          event.preventDefault();

          const fomr = document.getElementById("register") as HTMLFormElement;
          const helloo = fomr.getElementsByTagName("input");
          const formData = new FormData();
          for (const item of helloo) {
            formData.append(item.name, item.value);
          }
          const pass = formData.get("password") as string;
          const hashedPass = bcrypt.hashSync(pass, 10);
          formData.set("password", hashedPass);
          await registerUser(formData);
        }}
      >
        Register
      </button>

      {/* <div className="flex h-8 items-end space-x-1">
          {errorMessage && (
            <>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div> */}
    </div>
  );
}
