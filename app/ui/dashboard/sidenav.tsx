import NavLinks from "@/app/ui/dashboard/nav-links";
import { signOut } from "@/auth";
import { isAdmin } from "@/app/lib/data";

export default async function SideNav() {
  const ifAdmin = await isAdmin();
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-50">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks isAdmin={ifAdmin} />

        <div className="hidden h-auto w-full grow rounded-md  md:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-200 hover:text-gray-800 md:flex-none md:justify-start md:p-2 md:px-3">
            <div>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
