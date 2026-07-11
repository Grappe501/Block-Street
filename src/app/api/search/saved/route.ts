import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const path = join(process.cwd(), "data", "search", "saved_searches.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  return NextResponse.json(data);
}
