import { redirect } from "next/navigation";

/** Canonical product alias → protected admin workbench */
export default function CollegeCommandAliasPage() {
  redirect("/admin/college-command");
}
