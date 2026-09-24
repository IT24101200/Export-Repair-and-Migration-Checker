import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/server/storage";

// GET /api/session — Return authentication status and basic account information
export async function GET() {
  const user = getUserProfile();
  return NextResponse.json({
    signedIn: true,
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
  });
}
