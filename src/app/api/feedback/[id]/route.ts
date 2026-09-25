import { NextRequest, NextResponse } from "next/server";
import { deleteFeedbackRecord } from "@/lib/server/storage";

// DELETE /api/feedback/[id] — Delete a user feedback record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteFeedbackRecord(id);

  if (!success) {
    return NextResponse.json(
      {
        error: {
          code: "FEEDBACK_NOT_FOUND",
          message: "The requested feedback record does not exist or has already been deleted.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Feedback record deleted successfully.",
  });
}
