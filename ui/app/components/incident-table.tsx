"use client";
import { Incident } from "@/lib/incident";
import React from "react";
import DataTable from "react-data-table-component";
import { PacmanLoader } from "react-spinners";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function Table({ incidentList }: { incidentList: Incident[] }) {
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgba(209, 213, 219, 1)",
        textColor: "white",
      },
    },
  };
  let [stillMounting, setStillMounting] = React.useState(true);
  React.useEffect(() => {
    setStillMounting(false);
  }, []);
  const columns = [
    {
      name: "Title",
      selector: (i: Incident) => i.title || "",
    },
    {
      name: "At",
      selector: (i: Incident) => i.dateTime || "",
      sortable: true,
    },
    {
      name: "Near Miss Type",
      selector: (i: Incident) => i.nearMissType || "",
      sortable: true,
    },
    {
      name: "Concern Type",
      selector: (i: Incident) => i.concernType || "",
      sortable: true,
    },
    {
      name: "With Audio",
      cell: (i: Incident) => i.audio ? <CheckCircleIcon className="text-green-500 h-6 w-6" /> : <XCircleIcon className="text-slate-300 h-6 w-6" />,
    },
    {
      name: "Inferred",
      cell: (i: Incident) => i.inference ? <CheckCircleIcon className="text-green-500 h-6 w-6" /> : <XCircleIcon className="text-slate-300 h-6 w-6" />,
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={incidentList}
        title="Reported incidents"
        striped
        highlightOnHover
        pointerOnHover
        fixedHeader
        defaultSortAsc={false}
        defaultSortFieldId={2}
        progressPending={stillMounting}
        customStyles={customStyles}
        progressComponent={
          <div className="w-full h-80 grid justify-center content-center">
            <div>
              <PacmanLoader />
            </div>
          </div>
        }
        onRowClicked={(e: any) => {
          window.location.href = `/incident/${e.id}`;
        }}
      />
    </>
  );
}
