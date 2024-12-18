import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default async function Page(props: {
  params: Promise<{ topic: string }>;
}) {
  const params = await props.params;
  const topic = params.topic;

  return <p>{topic}</p>;
}
