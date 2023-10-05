import { Incident } from "@/lib/incident";
import { AudioPlayer } from "react-audio-player-component";

export default async function F({incident, width}: {incident: Incident, width: number}) {
  return (
    <AudioPlayer
      src={incident.audio}
      width={width}
      trackHeight={50}
      showLoopOption={false}
      key={incident.id}
    />
  )
}
