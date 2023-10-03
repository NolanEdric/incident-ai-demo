import { Incident } from "@/lib/incident";
import Form from "../../components/form";
export default function GET({ params }: { params: { id: string }}) {
  const i = new Incident(params.id + "x");
  return (
    <Form incident={i} />
  );
}
