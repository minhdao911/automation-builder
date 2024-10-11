import { GOOGLE_SCOPES } from "@/lib/constants";
import { ConnectorDataType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const scope = req.nextUrl.searchParams.get("scope");
  const redirectUrl = `${process.env.APP_URL}/connections`;

  if (scope) {
    const scopes = scope.split(" ");
    const hasRequiredScopes = GOOGLE_SCOPES.every((scope) =>
      scopes.includes(scope)
    );
    if (!hasRequiredScopes) {
      return NextResponse.redirect(
        `${redirectUrl}?dataType=${ConnectorDataType.Gmail}&error=Please select all required scopes to connect`
      );
    }
  }

  if (!code) {
    return NextResponse.redirect(
      `${redirectUrl}?dataType=${ConnectorDataType.Gmail}&error=Failed to authenticate with Google`
    );
  }

  const urlParams = new URLSearchParams({
    dataType: ConnectorDataType.Gmail,
    code,
  });
  return NextResponse.redirect(`${redirectUrl}?${urlParams.toString()}`);
}
