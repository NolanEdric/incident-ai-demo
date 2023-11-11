"use client";

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
import { RingLoader, GridLoader } from "react-spinners";

function countLines(str: String) {
  return (String(str).match(/\n/g) || "").length + 1;
}

// const docData1 = {
//   text: "エチレン製造装置のエタン分解炉のデコーキング作業が終了し、分解炉へエタンの供給を開始した。\nしばらくして分解炉出口温度の異常が表示されたので現場を確認したところ、分解炉からクエンチボイラーに至る配管のエルボ溶接部から炎が噴き出していた。\n調査の結果、分解炉内の輻射コイルには熱膨張を吸収するガイドスリーブが取り付けられているが、この中にスケールが詰まっていたため固定状態となり、配管に熱膨張による過大な曲げモーメントが作用し亀裂が入ったもの。",
//   entities: [
//     ["T1", "Product", [[0, 4]]],
//     ["T2", "Storage", [[0, 8]]],
//     ["T3", "Product", [[9, 12]]],
//     ["T4", "Storage", [[9, 15]]],
//     ["T5", "Process", [[16, 24]]],
//     ["T6", "Storage", [[29, 32]]],
//     ["T7", "Product", [[33, 36]]],
//     ["T8", "Process", [[37, 39]]],
//     ["T9", "Storage", [[52, 55]]],
//     ["T10", "Incident", [[60, 62]]],
//     ["T11", "Storage", [[81, 84]]],
//     ["T12", "Storage", [[86, 94]]],
//     ["T13", "Storage", [[97, 99]]],
//     ["T14", "Storage", [[100, 103]]],
//     ["T15", "Incident", [[108, 109]]],
//     ["T16", "Test", [[119, 121]]],
//     ["T17", "Storage", [[125, 128]]],
//     ["T18", "Storage", [[130, 135]]],
//     ["T19", "Incident", [[137, 140]]],
//     ["T20", "Storage", [[145, 152]]],
//     ["T21", "Incident", [[168, 172]]],
//     ["T22", "Incident", [[181, 185]]],
//     ["T23", "Storage", [[189, 191]]],
//     ["T24", "Incident", [[192, 195]]],
//     ["T25", "Incident", [[201, 208]]],
//     ["T26", "Incident", [[212, 214]]],
//     ["T27", "Event_others", [[52, 117]]],
//     ["T28", "Cause", [[125, 220]]],
//   ],
// };

function docData(incidentResponse: string) {
  let incidentResponseObj = JSON.parse(incidentResponse);
  let combinedList = [...incidentResponseObj.ann_ce_list, ...incidentResponseObj.ann_ner_list].sort((a,b)=> (parseInt(a._id.substring(1)) > parseInt(b._id.substring(1)) ? 1 : -1));
  const resp = {
    text: incidentResponseObj.text,
    entities: combinedList.map((e) => [e._id, e.type, [[e.start, e.end]]])
  }
  // console.log(JSON.stringify(resp));
  return resp;
}

function injectData(iframe_id: string, inference: string) {
  if (document) {
    const iframe: HTMLIFrameElement | null = document.getElementById(
      iframe_id
    ) as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify(docData(inference)));
    }
  }
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export default function AiInferResult({
  incident,
  inferenceLoading,
}: {
  incident: Incident;
  inferenceLoading: boolean;
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

  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );
  let [stillMounting, setStillMounting] = React.useState(true);

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (!inferenceLoading) {
      if (!stillMounting) {
        setStillMounting(true);
      }
      let timer = setTimeout(() => setStillMounting(false), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [inferenceLoading]);

  return (
    <>
      {inferenceLoading ? (
        <div className="flex flex-col items-center">
          <div className="mb-5 text-sm">Running AI ...</div>
          <RingLoader color="#36d7b7" />
        </div>
      ) : (
        incident &&
        incident.inference && (
          <>
            {stillMounting && (
              <div className="flex flex-col items-center">
                <div className="mb-5 text-sm">Visualizing ...</div>
                <GridLoader color="#36d7b7" />
              </div>
            )}
            <div style={{ display: !stillMounting ? "block" : "none" }}>
              <label className="block text-base font-medium leading-6 text-gray-900">
                AI output
              </label>
              <Iframe
                url="/brat/brat.html"
                width={String(windowDimensions.width - convertRemToPixels(2.5))}
                height={String(countLines(docData(incident.inference).text) * 75)}
                className="custom-pushback"
                id="result-iframe"
                onLoad={() =>
                  injectData("result-iframe", incident.inference || "")
                }
              />
              {/* <Accordion allowZeroExpanded allowMultipleExpanded className="my-2"> */}
              {/* <AccordionItem className="border-gray-500 border-2 rounded my-2">
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
              </AccordionItem> */}
              {/* <AccordionItem className="border-gray-500 border-2 rounded my-2">
                <AccordionItemHeading>
                  <AccordionItemButton className="bg-emerald-300 p-2">
                    Result
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  
                </AccordionItemPanel>
              </AccordionItem>
            </Accordion> */}
            </div>
          </>
        )
      )}
    </>
  );
}
