'use client'
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function Voice() {
  return (
    <>
      <div className="">
        <select name="" id="">
          <option value="">Record</option>
          <option value="">Upload</option>
        </select>
      </div>
      <AudioRecorder
        // onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
      />
    </>
  );
}
