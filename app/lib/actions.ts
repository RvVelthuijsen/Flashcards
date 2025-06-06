"use server";

import { signIn, auth } from "@/auth";
import { signIn as codeSignIn } from "@/codeAuth";
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

export async function updateTopic(topic: string) {
  const user = await auth();
  // If form validation fails, return errors early. Otherwise, continue.

  if (!user) {
    return {
      errors: {},
      message: "Not logged in.",
    };
  }

  try {
    await sql`
          UPDATE topics 
          SET (last_viewed) = ROW(${new Date().toISOString()})
          WHERE title = ${topic} AND useremail = ${user?.user?.email}
        `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Topic.",
      serverError: error,
      error: {},
    };
  }
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
}

export async function registerUser(credentials: FormData) {
  const parsedCredentials = z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse({
      name: credentials.get("name"),
      email: credentials.get("email"),
      password: credentials.get("password"),
    });
  if (parsedCredentials.success) {
    const { name, email, password } = parsedCredentials.data;

    try {
      await sql`
          INSERT INTO users (name, email, password)
          VALUES (${name}, ${email}, ${password} )
        `;
    } catch (error) {
      console.error("Failed to register user:", error);
      throw new Error("Failed to regsiter user.");
    }
  } else if (!parsedCredentials.success) {
    return {
      errors: parsedCredentials.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }
  redirect("/login");
}

export async function generateCode(code: string) {
  try {
    await sql`INSERT INTO register_codes (code)
              VALUES (${code})
    `;
  } catch (error) {
    console.error("Failed to create code", error);
    throw new Error("Code not valid.");
  }
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

export async function validateCode(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await codeSignIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid or previously used code.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
  revalidatePath("/register");
  redirect("/register");
}
