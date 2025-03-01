import { isAdmin } from "@/app/lib/data";
import { redirect } from "next/navigation";
import GenCode from "@/app/ui/components/generate-code";

export default async function AdminPage() {
  const ifAdmin = await isAdmin();
  if (!ifAdmin) {
    redirect("/dashboard");
  }
  return (
    <div className="flex gap-3">
      <GenCode />
    </div>
  );
}
