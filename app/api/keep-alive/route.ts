import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await db.user.count();

  return new NextResponse(`Ping DB OK: ${count} 🤖`, { status: 200 });
}
