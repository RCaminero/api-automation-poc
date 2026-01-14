export const authSuccessSchema = {
  type: "object",
  properties: {
    token: { type: "string" },
    refreshToken: { type: "string" },
    user: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        createdAt: { type: "string" }
      },
      required: ["id", "email"]
    },
    success: { type: "boolean" }
  },
  required: ["token", "user", "success"]
};

export const enrollmentSchema = {
  type: "object",
  properties: {
    series: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        series_id: { type: "string" },
        started_at: { type: "string", format: "date-time" },
        completed_at: { type: ["string", "null"] },
        status: { type: "string", enum: ["enrolled", "completed", "in_progress"] },
        series_detail: { type: "object" },
        progress_summary: { type: "object" },
        series_state: { type: "object" },
        fingerprint: {
          type: "object",
          properties: {
            hashcode: { type: "string" },
            calculated_at: { type: "string" }
          },
          required: ["hashcode"]
        }
      },
      required: ["user_id", "series_id", "status"]
    },
    success: { type: "boolean" }
  },
  required: ["series", "success"]
};

export const errorSchema = {
  type: "object",
  properties: {
    statusCode: { type: "number" },
    message: { anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }] },
    error: { type: "string" }
  },
  required: ["statusCode"]
};