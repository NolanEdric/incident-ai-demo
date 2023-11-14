"use client";

import React from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import {
  ArrowLeftCircleIcon,
  ArrowPathIcon,
  BoltIcon,
  CloudArrowDownIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { Incident } from "@/lib/incident";
import { getFormattedTime } from "@/lib/utils";
import AiInferResult from "./ai-infer-result";
import dynamic from "next/dynamic";
import { AudioRecorder } from "react-audio-voice-recorder";
import { BeatLoader } from "react-spinners";

const AudioPlayer = dynamic(() => import("./audioplayer"), {
  ssr: false,
  loading: () => (
    <div className="grid justify-center content-center">
      <div>
        <BeatLoader />
      </div>
    </div>
  ),
});

async function run_ai_infer(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  i: Incident,
  setIncident: React.Dispatch<React.SetStateAction<Incident>>,
  setInferenceLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.preventDefault();
  try {
    setInferenceLoading(true);
    const dataToPost = new FormData();
    if (i.id && i.audio) {
      dataToPost.set("id", i.id);
      const audioBlobRes = await fetch(i.audio);
      const audioBlob = await audioBlobRes.blob();
      dataToPost.set(
        "audio",
        audioBlob,
        `${audioBlob.type.split("/")[0]}-${getFormattedTime()}.${
          audioBlob.type.split("/")[1]
        }`
      );
      const res = await fetch("/ai/infer", {
        method: "POST",
        body: dataToPost,
      });
      const infered_json = await res.json();
      if (infered_json["error_code"]) {
        alert(
          `AI Error with code: ${infered_json["error_code"]} and message: ${
            infered_json["error_message"] || ""
          }`
        );
      } else {
        setIncident({
          ...i,
          inference: JSON.stringify(infered_json),
        });
      }
    }
  } finally {
    setInferenceLoading(false);
  }
}

async function submit(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  i: Incident,
  submitType: string
) {
  e.preventDefault();
  if (submitType === "submit") {
    const data = new FormData();
    if (i.audio) {
      const audioBlobRes = await fetch(i.audio);
      const audioBlob = await audioBlobRes.blob();
      data.set("audio", audioBlob, audioBlob.type);
    } else {
      data.set("audio", "");
    }
    data.set("id", i.id ? i.id : "");
    data.set("title", i.title ? i.title : "Untitled");
    data.set("nearMissType", i.nearMissType ? i.nearMissType : "Near Miss");
    data.set("concernType", i.concernType ? i.concernType : "Unsafe Act");
    data.set("dateTime", i.dateTime ? i.dateTime : new Date().toISOString());
    data.set("inference", i.inference ? i.inference : "");

    const res = await fetch(`/incident`, {
      method: "POST",
      headers: {},
      body: data,
    });
    if (res.ok) {
      alert("Saved");
      return;
    }
  } else if (submitType === "delete") {
    const res = await fetch(`/incident/${i.id}/api`, {
      method: "DELETE",
    });
    if (res.ok) {
      window.location.href = "/";
      return;
    }
  }
  alert(`${submitType} error`);
}

function downloadFile(uri: string | null) {
  if (uri) {
    fetch(uri)
      .then((r) => r.blob())
      .then((b) => {
        const link = document.createElement("a");
        link.download = `${b.type.split("/")[0]}-${getFormattedTime()}.${
          b.type.split("/")[1]
        }`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }
}

function useContainerDimensions(myRef: any) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
}

export default function Form({ incident }: { incident: Incident }) {
  const [voiceIME, setVoiceIME] = React.useState("upload");
  const [getIncident, setIncident] = React.useState(incident);
  const inputContainerRef = React.useRef<HTMLDivElement>(null);
  const [inferenceLoading, setInferenceLoading] = React.useState(false);
  const { width, height } = useContainerDimensions(inputContainerRef);

  return (
    <>
      <div className="p-5">
        <div className="flex justify-center">
          <div className="w-full sm:w-1/2" ref={inputContainerRef}>
            <div className="mb-5 flex justify-left">
              <a
                href="/"
                className="text-base font-semibold text-gray-400 hover:text-gray-800"
              >
                <ArrowLeftCircleIcon className="h-10 w-10" aria-hidden="true" />
              </a>
            </div>
            <form>
              <div className="mt-5 flex justify-center">
                <h1 className="text-xl font-semibold leading-7 text-gray-900">
                  Incident Reporting
                </h1>
              </div>
              <div className="flex md:flex-row flex-col">
                <div className="w-full flex justify-start">
                  <div className="md:w-11/12 w-full mt-5">
                    <label
                      htmlFor="id"
                      className="block text-base font-medium leading-6 text-gray-900"
                    >
                      Title
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="block flex-1 border-gray-300 rounded bg-gray-50 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                          value={getIncident.title ? getIncident.title : ""}
                          onChange={(e) => {
                            setIncident({
                              ...getIncident,
                              title: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-start">
                  <div className="md:w-11/12 w-full mt-5">
                    <label
                      htmlFor="id"
                      className="block text-base font-medium leading-6 text-gray-900"
                    >
                      Date time
                    </label>
                    <div className="mt-2">
                      <DateTimePicker
                        className="bg-gray-50"
                        required
                        value={
                          getIncident.dateTime
                            ? getIncident.dateTime
                            : new Date()
                        }
                        onChange={(e: any) => {
                          if (e) {
                            setIncident({
                              ...getIncident,
                              dateTime: e?.toISOString(),
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-row flex-col">
                <div className="w-full flex justify-start">
                  <div className="md:w-11/12 w-full mt-5">
                    <label
                      htmlFor="nearmisstype"
                      className="block text-base font-medium leading-6 text-gray-900"
                    >
                      Type of Near Miss
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <input
                          type="text"
                          name="nearmisstype"
                          list="nearmisstypelist"
                          id="nearmisstype"
                          className="block flex-1 border-gray-300 rounded bg-gray-50 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                          placeholder="type of near miss"
                          value={
                            getIncident.nearMissType
                              ? getIncident.nearMissType
                              : ""
                          }
                          onChange={(e) => {
                            setIncident({
                              ...getIncident,
                              nearMissType: e.target.value,
                            });
                          }}
                        />
                        <datalist id="nearmisstypelist">
                          <option value="Near Miss" />
                          <option value="Safety Concern" />
                          <option value="Safety Idea/Suggestion" />
                        </datalist>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-start">
                  <div className="md:w-11/12 w-full mt-5">
                    <label
                      htmlFor="concerntype"
                      className="block text-base font-medium leading-6 text-gray-900"
                    >
                      Type of Concern
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <input
                          type="text"
                          name="concerntype"
                          list="concerntypelist"
                          id="concerntype"
                          className="block flex-1 border-gray-300 rounded bg-gray-50 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                          placeholder="type of concern"
                          value={
                            getIncident.concernType
                              ? getIncident.concernType
                              : ""
                          }
                          onChange={(e) => {
                            setIncident({
                              ...getIncident,
                              concernType: e.target.value,
                            });
                          }}
                        />
                        <datalist id="concerntypelist">
                          <option value="Unsafe Act" />
                          <option value="Unsafe Condition of Area" />
                          <option value="Unsafe Condition of Equipment" />
                          <option value="Unsafe Use of Equipment" />
                          <option value="Safety Policy Violation" />
                        </datalist>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-base font-medium leading-6 text-gray-900">
                  Describe incident (
                  <a
                    href="/demo_samples/"
                    target="_blank"
                    className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Demo samples
                    <svg
                      className="w-4 h-4 ms-2 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </a>
                  )
                </label>
                {getIncident.audio ? (
                  <div className="my-2">
                    <AudioPlayer width={width} incident={getIncident} />
                    <div className="flex flex-row mt-4 justify-around">
                      <button
                        className="w-1/6 rounded bg-stone-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-stone-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600"
                        type="button"
                        onClick={(e) => {
                          if (getIncident.audio) {
                            URL.revokeObjectURL(getIncident.audio);
                            setIncident({
                              ...getIncident,
                              audio: null,
                            });
                          }
                        }}
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-center mb-1">
                            <ArrowPathIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          {/* Reinput */}
                        </div>
                      </button>
                      <button
                        className="w-1/6 rounded bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        type="button"
                        onClick={() => downloadFile(getIncident.audio)}
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-center mb-1">
                            <CloudArrowDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          {/* Download */}
                        </div>
                      </button>
                      <button
                        className="w-1/6 rounded bg-lime-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
                        type="button"
                        onClick={(e) =>
                          run_ai_infer(
                            e,
                            getIncident,
                            setIncident,
                            setInferenceLoading
                          )
                        }
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-center mb-1">
                            <BoltIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          {/* Run AI */}
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="my-2">
                    <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                      <select
                        className="block flex-1 border-gray-300 rounded bg-gray-50 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                        onChange={(val) => setVoiceIME(val.target.value)}
                      >
                        <option value="upload">Upload</option>
                        <option value="record">Record</option>
                      </select>
                    </div>
                    {voiceIME === "record" && (
                      <div className="my-2">
                        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-3 py-5">
                          <AudioRecorder
                            onRecordingComplete={(b: any) => {
                              setIncident({
                                ...getIncident,
                                audio: URL.createObjectURL(b),
                              });
                            }}
                            audioTrackConstraints={{
                              noiseSuppression: true,
                              echoCancellation: true,
                            }}
                            onNotAllowedOrFound={(err: DOMException) =>
                              console.table(err)
                            }
                            downloadOnSavePress={false}
                            downloadFileExtension="wav"
                            mediaRecorderOptions={{
                              audioBitsPerSecond: 128000,
                            }}
                            showVisualizer={true}
                          />
                        </div>
                      </div>
                    )}
                    {voiceIME === "upload" && (
                      <div className="my-2">
                        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-3 py-5">
                          <div className="text-center">
                            <div className="flex text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="audio-file"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <SpeakerWaveIcon
                                  className="mx-auto h-8 w-8"
                                  aria-hidden="true"
                                />
                                <span>Upload an audio file</span>
                              </label>
                              <input
                                id="audio-file"
                                accept=".wav,.mp3,audio/mp3,audio/wav"
                                name="audio-file"
                                type="file"
                                className="sr-only"
                                onChange={(e) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    setIncident({
                                      ...getIncident,
                                      audio: URL.createObjectURL(
                                        e.target.files[0]
                                      ),
                                    });
                                  }
                                }}
                              />
                            </div>
                            <p className="text-xs leading-5 text-gray-600">
                              WAV or MP3
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-5">
                <AiInferResult
                  incident={getIncident}
                  inferenceLoading={inferenceLoading}
                />
              </div>
              <div className="mt-5 flex justify-around">
                <button
                  type="submit"
                  onClick={(e) => submit(e, getIncident, "submit")}
                  className="rounded bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
                <button
                  type="submit"
                  onClick={(e) => submit(e, getIncident, "delete")}
                  className="rounded bg-rose-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
