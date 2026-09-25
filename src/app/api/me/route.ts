import { NextResponse } from "next/server";
import { getUserProfile, deleteUserAccount } from "@/lib/server/storage";

// GET /api/me — Return current user details
export async function GET() {
  const user = getUserProfile();
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    },
  });
}

// DELETE /api/me — Delete user account and all saved scan records
export async function DELETE() {
  deleteUserAccount();
  return NextResponse.json({
    success: true,
    message: "Your account and all associated scan summaries have been deleted.",
  });
}
