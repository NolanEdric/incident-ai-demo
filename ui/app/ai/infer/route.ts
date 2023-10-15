import { NextRequest } from "next/server";

const mock_res = {
  "job_id": "1",
  "metadata": {
    "version": "v3.0.3",
    "product_line": "rossa"
  },
  "error_code": "",
  "error_message": "",
  "result": [
    {
      "start": 0.43,
      "end": 10.43,
      "transcript": "で、恋の話なんですけど、私の話ではなく、もちろん、あのね、塾公のことなんだけど、中二の子たち持ってて、中二ってこう微妙な歳じゃない?"
    },
    {
      "start": 10.43,
      "end": 22.43,
      "transcript": "で、なんか国語担当してて、文学を教えるときに、例えば、宇野千代が出てきたらさ、もう宇野千代の恋愛演劇について多少学を研究しなきゃいけないとか、"
    },
    {
      "start": 22.43,
      "end": 33.43,
      "transcript": "あとは、なんだろう、恋愛の要素って、文学鑑賞するとき、特にこの後和歌が出てくるとか、そういうときに、ほら、こういうときってこうじゃないって話をしなきゃいけないじゃない?"
    },
    {
      "start": 33.43,
      "end": 40.43,
      "transcript": "それは鑑賞の一部だからしようと思っているんだけど、なんかね、多分ね、生徒の反応の方が微妙なのよ。"
    },
    {
      "start": 40.43,
      "end": 51.43,
      "transcript": "本人たちは興味があるから、こう授業中にこそこそっと書いてるメモとかをピッとやってみると、なんだか、デートしたいなみたいなこと書いてあって、めちゃくちゃ興味あるのね。"
    },
    {
      "start": 51.43,
      "end": 56.43,
      "transcript": "ただ、多分、私から言われるとちょっと聞くんだよね。"
    },
    {
      "start": 56.43,
      "end": 59.43,
      "transcript": "それをどうしたらいいのかな。"
    },
    {
      "start": 59.43,
      "end": 69.43,
      "transcript": "この間も雑巾色の話題を振って、私がちょっと参考に、この人を砕けた意見だから、こういう意見もまっとうな意見なんだよ。"
    },
    {
      "start": 69.43,
      "end": 77.43,
      "transcript": "論点作るときは、これもこういうのありなんだよって思って出した話題が、セクシャルな話題だったのね。"
    },
    {
      "start": 77.43,
      "end": 81.43,
      "transcript": "で、やっぱり反応悪いんだ。"
    },
    {
      "start": 81.43,
      "end": 94.43,
      "transcript": "興味はあるんだけど、多分すぐ嫌らしくなっちゃって、そんなこと自分が言うのは問題があると思っちゃうんじゃないのかな。"
    },
    {
      "start": 94.43,
      "end": 102.43,
      "transcript": "それはあると思う。多分個別だったらそれほど問題。私じゃなくて友達同士だったらあまり問題ないんだろうけど。"
    }
  ]
}

export async function POST(req: NextRequest) {
  let audio;
  let id;
  try {
    const postedData = await req.formData();
    audio = postedData.get("audio") as Blob;
    id = postedData.get("id") as string;
  } catch (e) {
    return new Response("invalid request", {
      status: 400
    })
  }

  const dataToPost = new FormData();
  dataToPost.set("job_id", id);
  dataToPost.set("input", audio);
  // const res = await fetch(ai_service, {
  //   method: "POST",
  //   headers: {
  //     "accept": "application/json",
  //   },
  //   body: dataToPost
  // });
  
  // const json = await res.json();
  // return new Response(JSON.stringify(json), {
  //   status: res.status,
  //   statusText: res.statusText
  // });

  await new Promise(resolve => setTimeout(resolve, 1000));

  mock_res.job_id = new Date().toISOString();
  
  return new Response(JSON.stringify(mock_res));
}
