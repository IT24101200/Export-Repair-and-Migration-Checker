import { NextResponse } from "next/server";
import { deleteUserAccount } from "@/lib/server/storage";

// DELETE /api/me — Delete user account and all saved scan records
export async function DELETE() {
  deleteUserAccount();
  return NextResponse.json({
    success: true,
    message: "Your account and all associated scan summaries have been deleted.",
  });
}
