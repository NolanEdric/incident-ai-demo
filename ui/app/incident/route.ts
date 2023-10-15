import { redirect, useSearchParams } from 'next/navigation';
import { addRecord, updateRecord } from "@/lib/crud";
import { Incident } from '@/lib/incident';
import { NextRequest, NextResponse } from 'next/server';
import { audio_storage_path } from '@/lib/check-env';
import del from 'delete';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(req: NextRequest) {
  const i = await addRecord();

  if (i) {
    redirect(`/incident/${i.id}`);
  }

  throw new Error("Cannot create incident record");
}

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const i = new Incident();
  i.id = data.get('id')?.toString() || null;
  const file: File | null = data.get('audio') as unknown as File;
  const path = `${audio_storage_path}/${i.id}.${file.name}`;

  if (file) {
    await del([`${audio_storage_path}/${i.id}.*`], async function (err: any, deleted: any) {
      if (err) throw err;
      // deleted files
      // console.log(deleted);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (!existsSync(audio_storage_path)) {
        await mkdir(audio_storage_path);
      }
      await writeFile(path, buffer);
      i.audio = `/incident/${i.id}/api/audio?ext=${file.name}`;
      i.title = data.get('title')?.toString() || null;
      i.nearMissType = data.get('nearMissType')?.toString() || null;
      i.concernType = data.get('concernType')?.toString() || null;
      i.inference = data.get('inference')?.toString() || null;
      i.dateTime = data.get('dateTime')?.toString() || null;
      const updateRes = await updateRecord(i);
      if (!updateRes || updateRes.modifiedCount === 0) {
        throw new Error("fail to update record");
      }
    });
  } else {
    i.title = data.get('title')?.toString() || null;
    i.nearMissType = data.get('nearMissType')?.toString() || null;
    i.concernType = data.get('concernType')?.toString() || null;
    i.inference = data.get('inference')?.toString() || null;
    i.dateTime = data.get('dateTime')?.toString() || null;
    const updateRes = await updateRecord(i);
    if (!updateRes || updateRes.modifiedCount === 0) {
      throw new Error("fail to update record");
    }
  }
  return new Response();
}
