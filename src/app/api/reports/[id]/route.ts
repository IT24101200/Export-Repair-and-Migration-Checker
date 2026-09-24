import { NextRequest, NextResponse } from "next/server";
import { getReportById, deleteReportRecord } from "@/lib/server/storage";

// GET /api/reports/[id] — Retrieve single summary by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    return NextResponse.json(
      {
        error: {
          code: "REPORT_NOT_FOUND",
          message: "The requested summary report does not exist.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ report });
}

// DELETE /api/reports/[id] — Delete single summary by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = deleteReportRecord(id);

  if (!success) {
    return NextResponse.json(
      {
        error: {
          code: "REPORT_NOT_FOUND",
          message: "The requested summary report could not be found or has already been deleted.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, message: "Summary deleted successfully." });
}
