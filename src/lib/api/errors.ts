import { NextResponse } from "next/server";
import type { ApiErrorBody, ApiMeta } from "./types";

export class ApiError extends Error {
  status: number;
  code: string;
  fields?: Record<string, string>;
  constructor(code: string, message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

export function apiErrorResponse(err: ApiError | unknown, requestId: string) {
  if (err instanceof ApiError) {
    const body: { error: ApiErrorBody } = {
      error: {
        code: err.code,
        message: err.message,
        request_id: requestId,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    };
    return NextResponse.json(body, { status: err.status });
  }
  const e = err as { message?: string };
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: e.message ?? "An unexpected error occurred.", request_id: requestId } },
    { status: 500 }
  );
}

export function apiSuccess<T>(data: T, meta: ApiMeta, status = 200, headers?: Record<string, string>) {
  const res = NextResponse.json({ data, meta }, { status });
  if (headers) {
    for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
  }
  res.headers.set("X-Request-Id", meta.request_id);
  if (meta.correlation_id) res.headers.set("X-Correlation-Id", meta.correlation_id);
  return res;
}
