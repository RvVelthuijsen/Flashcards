import { fetchTopics } from "@/app/lib/data";
import { Topic } from "@/app/lib/definitions";
import Link from "next/link";

export default async function CardWrapper() {
  const topics = await fetchTopics();
  return (
    <>
      {topics.map((topic: Topic, index: Number) => (
        <Card title={topic.title} key={index.toString()} />
      ))}
    </>
  );
}

export function Card({ title }: { title: string }) {
  return (
    <Link href={`/dashboard/topics/${title}`}>
      <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <p
          className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {title}
        </p>
      </div>
    </Link>
  );
}
