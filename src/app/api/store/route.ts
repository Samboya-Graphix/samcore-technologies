import { NextRequest, NextResponse } from "next/server";
import { readServerDb, writeServerDb, ServerStoreDatabase } from "@/lib/server-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = readServerDb();
  return NextResponse.json({ ok: true, data: db });
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ServerStoreDatabase>;
    const updated = writeServerDb(body);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to update store state" },
      { status: 400 }
    );
  }
}
