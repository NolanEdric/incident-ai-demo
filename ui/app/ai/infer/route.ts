import { ai_service } from "@/lib/check-env";
import { unlink, writeFile } from "fs/promises";
import { NextRequest } from "next/server";

const mock_res = {
  "ann_ce_list": [
    {
      "_id": "T28",
      "end": 116,
      "start": 51,
      "text": "分解炉出口温度の異常が表示されたので現場を確認したところ、分解炉からクエンチボイラーに至る配管のエルボ溶接部から炎が噴き出していた",
      "type": "Event_others"
    },
    {
      "_id": "T29",
      "end": 186,
      "start": 123,
      "text": "分解炉内の輻射コイルには熱膨張を吸収するガイドスリーブが取り付けられているが、この中にスケールが詰まっていたため固定状態となり",
      "type": "Cause"
    }
  ],
  "ann_ner_list": [
    {
      "_id": "T1",
      "end": 8,
      "start": 0,
      "text": "エチレン製造装置",
      "type": "Process"
    },
    {
      "_id": "T2",
      "end": 4,
      "start": 0,
      "text": "エチレン",
      "type": "Product"
    },
    {
      "_id": "T3",
      "end": 15,
      "start": 9,
      "text": "エタン分解炉",
      "type": "Process"
    },
    {
      "_id": "T4",
      "end": 12,
      "start": 9,
      "text": "エタン",
      "type": "Product"
    },
    {
      "_id": "T5",
      "end": 15,
      "start": 12,
      "text": "分解炉",
      "type": "Process"
    },
    {
      "_id": "T6",
      "end": 24,
      "start": 16,
      "text": "デコーキング作業",
      "type": "Test"
    },
    {
      "_id": "T7",
      "end": 32,
      "start": 29,
      "text": "分解炉",
      "type": "Process"
    },
    {
      "_id": "T8",
      "end": 36,
      "start": 33,
      "text": "エタン",
      "type": "Product"
    },
    {
      "_id": "T9",
      "end": 39,
      "start": 37,
      "text": "供給",
      "type": "Test"
    },
    {
      "_id": "T10",
      "end": 54,
      "start": 51,
      "text": "分解炉",
      "type": "Process"
    },
    {
      "_id": "T11",
      "end": 61,
      "start": 59,
      "text": "異常",
      "type": "Incident"
    },
    {
      "_id": "T12",
      "end": 83,
      "start": 80,
      "text": "分解炉",
      "type": "Process"
    },
    {
      "_id": "T13",
      "end": 93,
      "start": 85,
      "text": "クエンチボイラー",
      "type": "Process"
    },
    {
      "_id": "T14",
      "end": 98,
      "start": 96,
      "text": "配管",
      "type": "Process"
    },
    {
      "_id": "T15",
      "end": 102,
      "start": 99,
      "text": "エルボ",
      "type": "Process"
    },
    {
      "_id": "T16",
      "end": 108,
      "start": 107,
      "text": "炎",
      "type": "Incident"
    },
    {
      "_id": "T17",
      "end": 119,
      "start": 117,
      "text": "調査",
      "type": "Chemical"
    },
    {
      "_id": "T18",
      "end": 126,
      "start": 123,
      "text": "分解炉",
      "type": "Process"
    },
    {
      "_id": "T19",
      "end": 133,
      "start": 128,
      "text": "輻射コイル",
      "type": "Process"
    },
    {
      "_id": "T20",
      "end": 138,
      "start": 135,
      "text": "熱膨張",
      "type": "Incident"
    },
    {
      "_id": "T21",
      "end": 150,
      "start": 143,
      "text": "ガイドスリーブ",
      "type": "Process"
    },
    {
      "_id": "T22",
      "end": 170,
      "start": 166,
      "text": "スケール",
      "type": "Incident"
    },
    {
      "_id": "T23",
      "end": 183,
      "start": 179,
      "text": "固定状態",
      "type": "Incident"
    },
    {
      "_id": "T24",
      "end": 189,
      "start": 187,
      "text": "配管",
      "type": "Process"
    },
    {
      "_id": "T25",
      "end": 193,
      "start": 190,
      "text": "熱膨張",
      "type": "Incident"
    },
    {
      "_id": "T26",
      "end": 206,
      "start": 199,
      "text": "曲げモーメント",
      "type": "Incident"
    },
    {
      "_id": "T27",
      "end": 212,
      "start": 210,
      "text": "亀裂",
      "type": "Incident"
    }
  ],
  "text": "エチレン製造装置のエタン分解炉のデコーキング作業が終了し、分解炉へエタンの供給を開始した。\nしばらくして分解炉出口温度の異常が表示されたので現場を確認したところ、分解炉からクエンチボイラーに至る配管のエルボ溶接部から炎が噴き出していた。調査の結果、\n分解炉内の輻射コイルには熱膨張を吸収するガイドスリーブが取り付けられているが、\nこの中にスケールが詰まっていたため固定状態となり、\n配管に熱膨張による過大な曲げモーメントが作用し亀裂が入ったもの。"
}

export async function POST(req: NextRequest) {
  let audio;
  let id;
  let path;
  try {
    const postedData = await req.formData();
    audio = postedData.get("audio") as File;
    id = postedData.get("id") as string;
  } catch (e) {
    console.log(e);
    return new Response("invalid request", {
      status: 400
    })
  }

  try {
    const bytes = await audio.arrayBuffer();
    const buffer = Buffer.from(bytes);
    path = `/tmp/${id}.${audio.type.split("/")[1]}`;
    await writeFile(path, buffer, {
      encoding: 'binary',
      mode: 0o777
    });

    const dataToPost = new FormData();
    dataToPost.append("audio_path", path);
    const res = await fetch(ai_service, {
      method: "POST",
      headers: {
        "accept": "application/json",
      },
      body: dataToPost
    });
    await unlink(path);
    const json = await res.json();

    return new Response(JSON.stringify(json), {
      status: res.status,
      statusText: res.statusText
    });
  } catch (e) {
    console.log(e);
    return new Response("error invoking ai", {
      status: 500
    });

  }

  // await new Promise(resolve => setTimeout(resolve, 5000));

  // return new Response(JSON.stringify(mock_res));
}
