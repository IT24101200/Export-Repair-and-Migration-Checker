import { NextRequest, NextResponse } from "next/server";
import { CreateFeedbackSchema } from "@/lib/validation/feedback";
import { listUserFeedback, createFeedbackRecord } from "@/lib/server/storage";

// GET /api/feedback — List user's submitted feedback
export async function GET() {
  try {
    const feedbackList = listUserFeedback();
    return NextResponse.json({
      feedback: feedbackList,
      count: feedbackList.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: err?.message || "Failed to retrieve feedback records",
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/feedback — Submit voluntary structured feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateFeedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message || "Invalid feedback data",
          },
        },
        { status: 400 }
      );
    }

    const { record, status } = createFeedbackRecord(parsed.data);

    if (status === "conflict") {
      return NextResponse.json(
        {
          error: {
            code: "CONFLICTING_FEEDBACK",
            message: "A feedback record with this clientFeedbackId already exists with different responses.",
          },
        },
        { status: 409 }
      );
    }

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
          message: err?.message || "Failed to submit feedback",
        },
      },
      { status: 500 }
    );
  }
}
