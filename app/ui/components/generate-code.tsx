"use client";
import { generateCode } from "@/app/lib/actions";
import bcrypt from "bcryptjs";

export default function GenCode() {
  return (
    <>
      <button
        className="cursor-pointer bg-white rounded-md border border-gray-200 py-2 px-2 text-sm outline-2 text-gray-500 flex justify-between items-center"
        onClick={async (event) => {
          const codeField = document.getElementById("code-field");
          const code = bcrypt.genSaltSync(1).slice(-8);
          if (codeField) {
            codeField.innerText = code;
          }
          const hi = await generateCode(code);
          console.log(hi);
        }}
      >
        Generate Code
      </button>
      <div className="flex gap-3">
        <p>code:</p>
        <p id="code-field"></p>
      </div>
    </>
  );
}
