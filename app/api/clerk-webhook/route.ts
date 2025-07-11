import { db } from "@/lib/db";
import { getAuthUrl, getTokenInfo } from "@/lib/google-auth";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing Clerk webhook secret");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  try {
    const eventType = evt.type;
    if (eventType === "user.created") {
      console.log("User created event received");
      await db.user.create({
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
        },
      });

      // const googleAccount = evt.data.external_accounts.find(
      //   (account: any) => account.object === "google_account"
      // );
      // if (googleAccount) {
      //   //   console.log("User has Google account");
      //   //   const scopes = googleAccount.approved_scopes.split(" ");
      //   //   const authUrl = await getAuthUrl(scopes);
      //   //   redirect(authUrl);
      //   const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
      //     evt.data.id,
      //     "oauth_google"
      //   );
      //   console.log("clerkResponse", clerkResponse);
      //   const accessToken = clerkResponse.data[0].token;
      //   const tokenInfo = await getTokenInfo(accessToken);
      //   console.log("tokenInfo", tokenInfo);
      //   const googleCredential = await db.googleCredential.create({
      //     data: {
      //       accessToken,
      //       userId: user.clerkId,
      //       expiryDate: "" + tokenInfo.expiry_date,
      //       scopes: tokenInfo.scopes,
      //     },
      //   });
      //   await db.connection.create({
      //     data: {
      //       userId: user.clerkId,
      //       googleCredentialId: googleCredential.id,
      //     },
      //   });
      // }

      return new NextResponse("User created successfully", { status: 201 });
    }
    return new Response("Event not supported", { status: 200 });
  } catch (err) {
    console.error("Error saving user:", err);
    return new Response("Error creating user in database", {
      status: 500,
    });
  }
}
