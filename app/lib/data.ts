import { sql } from "@vercel/postgres";
import { Topic, Flashcard } from "./definitions";
import { auth } from "@/auth";

export async function fetchTopics() {
  const user = await auth();
  try {
    const data = await sql<Topic>`SELECT * FROM topics
    WHERE useremail = ${user?.user?.email}`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic data.");
  }
}

export async function fetchMostRecentTopics() {
  const user = await auth();
  try {
    const data = await sql<Topic>`SELECT * FROM topics
    WHERE useremail = ${user?.user?.email}
    ORDER BY last_viewed DESC
    LIMIT 3`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to recent fetch topic data.");
  }
}

export async function fetchFlashcards(topic: string) {
  const user = await auth();
  try {
    const data = await sql<Flashcard>`SELECT * FROM flashcards
    WHERE   useremail = ${user?.user?.email} AND
            topic = ${topic}`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch flashcard data.");
  }
}
