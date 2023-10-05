import { delRecord } from "@/lib/crud";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const delRes = await delRecord(params.id);
  if (delRes) {
    return new Response("delete successful");
  }

  return new Response("delete error", {
    status: 500
  });
}
