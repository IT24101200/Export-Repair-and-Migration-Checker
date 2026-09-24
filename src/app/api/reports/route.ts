import { NextRequest, NextResponse } from "next/server";
import { CreateReportSchema } from "@/lib/validation/reports";
import { listUserReports, createReportRecord } from "@/lib/server/storage";

// GET /api/reports — List user's saved summary records
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = parseInt(searchParams.get("limit") || "20", 10);
    const limit = isNaN(limitParam) ? 20 : limitParam;

    const reports = listUserReports(limit);

    return NextResponse.json({
      reports,
      count: reports.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: err?.message || "Failed to retrieve summaries",
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/reports — Save a new scan summary record with validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message || "Invalid summary data",
          },
        },
        { status: 400 }
      );
    }

    const { record, status } = createReportRecord(parsed.data);

    if (status === "conflict") {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICTING_RECORD",
            message: "A summary with this clientResultId already exists with different counts.",
          },
        },
        { status: 409 }
      );
    }

    // Return 200 for idempotent retry, 201 for fresh creation
    return NextResponse.json(
      {
        record,
        status,
      },
      { status: status === "existing" ? 200 : 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: err?.message || "Failed to save summary",
        },
      },
      { status: 500 }
    );
  }
}
