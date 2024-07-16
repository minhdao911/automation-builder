import { db } from "@/lib/db";
import { runWorkflows } from "@/lib/workflows";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("Drive notification received");

  const headerList = headers();
  const resourceId = headerList.get("x-goog-resource-id");
  const resourceState = headerList.get("x-goog-resource-state");

  console.log("Resource ID: ", resourceId);
  console.log("Resource State: ", resourceState);

  if (resourceId && resourceState) {
    const workflows = await db.workflow.findMany({
      where: {
        driveResourceId: resourceId,
      },
    });

    if (workflows.length === 0) {
      return NextResponse.json({
        message: `No workflows found for resource id ${resourceId}`,
      });
    }

    try {
      await runWorkflows(workflows, { resourceState });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        return NextResponse.json({ message: e.message });
      }
      console.error(e);
      return NextResponse.json(
        { message: "Error running workflow" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Success" });
}
