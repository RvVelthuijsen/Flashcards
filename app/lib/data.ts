import { sql } from "@vercel/postgres";
import { Topic } from "./definitions";

export async function fetchTopics() {
  try {
    const data = await sql<Topic>`SELECT * FROM topics`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic data.");
  }
}
