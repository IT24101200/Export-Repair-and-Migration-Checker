// Validation schemas for structured product feedback matching Section 4.1

import { z } from "zod";

export const CreateFeedbackSchema = z.object({
  clientFeedbackId: z.string().min(1).max(100),
  schemaVersion: z.literal(1),
  engineVersion: z.string().min(1).max(20),
  sourceFormat: z.literal("notion_markdown_csv"),
  outcome: z.enum(["helped", "partly_helped", "not_helped", "not_sure"]),
  reasonCode: z.enum([
    "none",
    "selecting_export",
    "understanding_findings",
    "repair_options",
    "download",
    "unsupported_format",
    "performance",
    "other",
  ]),
});

export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
