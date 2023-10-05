import { Incident } from "@/lib/incident";
import Form from "../../components/form";
import { getRecord } from "@/lib/crud";
import { notFound } from "next/navigation";
import { existsSync } from "fs";
import { audio_storage_path } from "@/lib/check-env";

function audioExists(id: string, audioPath: string) {
  const parts = audioPath.split('?');
  if (parts.length > 1) {
    const ext = parts[1].split('=')[1];
    return existsSync(`${audio_storage_path}/${id}.${ext}`);
  }
  return false;
}
export default async function IncidentPage({ params }: { params: { id: string }}) {
  const i = await getRecord(params.id);
  if (!i) {
    return notFound();
  }
  
  if (i.id && i.audio) {
    if (!audioExists(i.id, i.audio)) {i.audio = ""};
  }
  return (
    <Form incident={i} />
  );
}
