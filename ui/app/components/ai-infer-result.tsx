import { Incident } from "@/lib/incident";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import Iframe from "react-iframe";
import { RingLoader } from "react-spinners";
import DataTable from "react-data-table-component";

const docData = {
  text: "Ed O'Kelley was the man who shot the man who shot Jesse James.",
  entities: [
    ["T1", "Person", [[0, 11]]],
    ["T2", "Person", [[20, 23]]],
    ["T3", "Person", [[37, 40]]],
    ["T4", "Person", [[50, 61]]],
  ],
};

function injectData(iframe_id: string, inference: string) {
  if (document) {
    const iframe: HTMLIFrameElement | null = document.getElementById(
      iframe_id
    ) as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify(docData));
    }
  }
}

export default function AiInferResult({
  incident,
  width,
  loading,
}: {
  incident: Incident;
  width: string;
  loading: boolean;
}) {
  const ASRCustomStyles = {
    headCells: {
      style: {
        backgroundColor: "rgba(209, 213, 219, 1)",
        textColor: "white",
      },
    },
  };
  const ASRColumns = [
    {
      name: "Time",
      cell: (i: any) => <span>{`${i.start}s\n${i.end}s`}</span>,
      selector: (i: any) => i.start,
      sortable: true,
      grow: 0,
      style: {
        WhiteSpace: "pre",
        backgroundColor: "rgba(229, 231, 235, 1)",
      },
    },
    {
      name: "Transcript",
      selector: (i: any) => i.transcript,
      wrap: true,
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <RingLoader color="#36d7b7" />
        </div>
      ) : (
        incident &&
        incident.inference && (
          <div>
            <label className="block text-base font-medium leading-6 text-gray-900">
              Incident AI infererence results
            </label>
            <Accordion allowZeroExpanded allowMultipleExpanded className="my-2">
              <AccordionItem className="border-gray-500 border-2 rounded my-2">
                <AccordionItemHeading>
                  <AccordionItemButton className="bg-orange-300 p-2">
                    ASR
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <DataTable
                    columns={ASRColumns}
                    data={JSON.parse(incident.inference).result}
                    striped
                    highlightOnHover
                    fixedHeader
                    defaultSortAsc
                    customStyles={ASRCustomStyles}
                    defaultSortFieldId={1}
                  />
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem className="border-gray-500 border-2 rounded my-2">
                <AccordionItemHeading>
                  <AccordionItemButton className="bg-sky-300 p-2">
                    NER
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <Iframe
                    url="/brat/ner.html"
                    width={width}
                    id="ner-iframe"
                    onLoad={() =>
                      injectData("ner-iframe", incident.inference || "")
                    }
                  />
                </AccordionItemPanel>
              </AccordionItem>
              <AccordionItem className="border-gray-500 border-2 rounded my-2">
                <AccordionItemHeading>
                  <AccordionItemButton className="bg-emerald-300 p-2">
                    CE
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <Iframe
                    url="/brat/ce.html"
                    width={width}
                    id="ce-iframe"
                    onLoad={() =>
                      injectData("ce-iframe", incident.inference || "")
                    }
                  />
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion>
          </div>
        )
      )}
    </>
  );
}
