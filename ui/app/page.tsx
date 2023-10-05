import IncidentTable from "@/app/components/incident-table";
import { listRecord } from "@/lib/crud";

export const dynamic = "force-dynamic";
export default async function List() {
  return (
    <>
      <div className="p-5">
          <div className="w-full">
            <a href="/incident" className="href">
              <button className="rounded bg-emerald-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                New incident
              </button>
            </a>
            <IncidentTable incidentList={await listRecord()} />
          </div>
      </div>
    </>
  );
}
