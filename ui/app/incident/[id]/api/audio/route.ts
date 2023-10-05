import { audio_storage_path } from "@/lib/check-env";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const sp = req.nextUrl.searchParams;
  const ext = sp.get('ext');
  if (!sp) {
    return notFound();
  }
  try {
    const filePath = path.join(audio_storage_path, `${params.id}.${ext}`);

    if (!existsSync(filePath)) {
      return notFound();
    }
    return new Response(await readFile(filePath), { headers: { 'content-type': `audio/${ext}` } });
  } catch (e) {
    console.log("Get audio:"+e);
  }
  throw new Error("error getting audio");
}
