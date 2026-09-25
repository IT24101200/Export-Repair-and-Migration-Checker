import { NextRequest, NextResponse } from "next/server";
import { UpdateProfileSchema } from "@/lib/validation/reports";
import { getUserProfile, updateUserProfile } from "@/lib/server/storage";

// GET /api/profile — Fetch current user profile
export async function GET() {
  const user = getUserProfile();
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
  });
}

// PATCH /api/profile — Update user's display name
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PROFILE_DATA",
            message: parsed.error.issues[0]?.message || "Invalid profile data",
          },
        },
        { status: 400 }
      );
    }

    const updatedUser = updateUserProfile(parsed.data.displayName);

    return NextResponse.json({
      success: true,
      user: {
        email: updatedUser.email,
        displayName: updatedUser.displayName,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: err?.message || "Failed to update profile",
        },
      },
      { status: 500 }
    );
  }
}
