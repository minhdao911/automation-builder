import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("Drive notification received");

  const headerList = headers();
  const resourceId = headerList.get("x-goog-resource-id");
  const resourceState = headerList.get("x-goog-resource-state");

  console.log(`Resource ID: ${resourceId}`);
  console.log(`Resource State: ${resourceState}`);

  return NextResponse.json({ message: "Success" });
}
