"use server";

import { signIn, auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Flashcard } from "./definitions";

const TopicFormSchema = z.object({
  id: z.string(),
  title: z
    .string({
      invalid_type_error: "Please enter a title.",
    })
    .min(1),
});

const CategoryFormSchema = z.object({
  id: z.string(),
  title: z.string({
    invalid_type_error: "Please enter a title.",
  }),
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
  categories: z.string({
    invalid_type_error: "Please enter a category.",
  }),
});

const CreateTopic = TopicFormSchema.omit({ id: true });
const CreateCategory = CategoryFormSchema.omit({ id: true });
const CreateFlashcard = FlashcardFormSchema.omit({ id: true });

export type TopicState = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

export type CategoryState = {
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

export async function addTopic(prevState: TopicState, formData: FormData) {
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
          INSERT INTO topics (title, useremail, last_viewed)
          VALUES (${title}, ${user?.user?.email}, ${new Date().toISOString()})
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

export async function addCategory(formData: FormData, topic: string) {
  if (formData.get("title") == "") {
    return {
      errors: {},
      message: "Missing Fields. Failed to Create Category.",
    };
  }
  const validatedFields = CreateCategory.safeParse({
    title: formData.get("title"),
  });
  const user = await auth();
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Category.",
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
          INSERT INTO categories (title, useremail, topic)
          VALUES (${title}, ${user?.user?.email}, ${topic})
        `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Category.",
      error: {},
    };
  }
  // finally {
  //   revalidatePath("/dashboard/topics");
  //   redirect(`/dashboard/topics/${topic}`);
  // }
}

export async function addFlashcard(
  prevState: FlashcardState,
  formData: FormData
) {
  const validatedFields = CreateFlashcard.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    topic: formData.get("topic"),
    categories: formData.get("category-dropdown-input"),
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
  const { question, answer, topic, categories } = validatedFields.data;
  try {
    await sql`
          INSERT INTO flashcards (question, answer, useremail, topic, categories, created)
          VALUES (${question}, ${answer}, ${
      user?.user?.email
    }, ${topic}, ${categories}, ${new Date().toISOString()})
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

export async function editFlashcard(card: Flashcard) {
  const user = await auth();

  if (!user) {
    return {
      errors: {},
      message: "Not logged in.",
    };
  }

  const validatedFields = CreateFlashcard.safeParse({
    question: card.question,
    answer: card.answer,
    topic: card.topic,
    categories: card.categories,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Flashcards cause fields.",
    };
  }

  const { question, answer, topic, categories } = validatedFields.data;
  try {
    await sql`
          UPDATE flashcards 
          SET (question, answer, useremail, topic, categories) = (${question}, ${answer}, ${user?.user?.email}, ${topic}, ${categories})
          WHERE id = ${card.id}
        `;
  } catch (error) {
    return {
      message: "Database Error: Failed to update Flashcard on insert.",
      test: error,
      error: {},
    };
  }
  revalidatePath(`/dashboard/topics/${topic}`);
  // redirect(`/dashboard/topics/${topic}`);
}

export async function deleteFlashcard(card: Flashcard) {
  const user = await auth();

  if (!user) {
    return {
      errors: {},
      message: "Not logged in.",
    };
  }

  try {
    await sql`
          DELETE FROM flashcards 
          WHERE id = ${card.id}
        `;
  } catch (error) {
    return {
      message: "Database Error: Failed to delete Flashcard.",
      returnError: error,
      error: {},
    };
  }
  revalidatePath(`/dashboard/topics/${card.topic}`);
  //redirect(`/dashboard/topics/${card.topic}`);
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
