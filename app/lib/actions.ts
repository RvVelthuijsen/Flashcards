"use server";

import { signIn, auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  title: z
    .string({
      invalid_type_error: "Please enter a title.",
    })
    .min(1),
});

const FlashcardFormSchema = z.object({
  id: z.string(),
  answer: z
    .string({
      invalid_type_error: "Please enter an answer.",
    })
    .min(1),
  question: z
    .string({
      invalid_type_error: "Please enter a question.",
    })
    .min(1),
  topic: z
    .string({
      invalid_type_error: "Please enter a topic.",
    })
    .min(1),
});

const CreateTopic = FormSchema.omit({ id: true });
const CreateFlashcard = FlashcardFormSchema.omit({ id: true });

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

export type FlashcardState = {
  errors?: {
    question?: string[];
    answer?: string[];
    topic?: string[];
  };
  message?: string | null;
};

export async function addTopic(prevState: State, formData: FormData) {
  const validatedFields = CreateTopic.safeParse({
    title: formData.get("title"),
  });
  const user = await auth();
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Topic.",
    };
  }
  if (!user) {
    return {
      errors: {},
      message: "Not logged in.",
    };
  }
  const { title } = validatedFields.data;
  try {
    await sql`
          INSERT INTO topics (title, useremail)
          VALUES (${title}, ${user?.user?.email})
        `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Topic.",
      error: {},
    };
  }
  revalidatePath("/dashboard/topics");
  redirect("/dashboard/topics");
}

export async function addFlashcard(
  prevState: FlashcardState,
  formData: FormData
) {
  const validatedFields = CreateFlashcard.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    topic: formData.get("topic"),
  });
  const user = await auth();
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Flashcards.",
    };
  }
  if (!user) {
    return {
      errors: {},
      message: "Not logged in.",
    };
  }
  const { question, answer, topic } = validatedFields.data;
  try {
    await sql`
          INSERT INTO flashcards (question, answer, useremail, topic)
          VALUES (${question}, ${answer}, ${user?.user?.email}, ${topic})
        `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Flashcard.",
      error: {},
    };
  }
  revalidatePath("/dashboard/topics");
  redirect(`/dashboard/topics/${topic}`);
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
