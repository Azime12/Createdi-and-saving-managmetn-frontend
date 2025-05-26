import { Metadata } from "next";
import UsersTable from "@/app/ui/users/UsersTable";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system users from the admin panel",
};

export default function UsersPage() {
  return (
    <div className="">
      <UsersTable/>
    </div>
  );
}