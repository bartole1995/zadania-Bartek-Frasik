import { useState, useEffect } from "react";
import { Card, Space, Button, Checkbox } from "antd";
import {
  CaretRightOutlined,
  AudioOutlined,
  DeleteOutlined,
  PauseOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import { Howl, Howler } from "howler";
import "./App.css";

interface Track {
  id: string;
  howl: Howl | null;
  playing: boolean;
  checked: boolean;
}

const initTracks: Track[] = [
  { id: "1", howl: null, playing: false, checked: false },
  { id: "2", howl: null, playing: false, checked: false },
  { id: "3", howl: null, playing: false, checked: false },
  { id: "4", howl: null, playing: false, checked: false },
];

const data = ["STOPA", "HI-HAT", "WERBEL", "OPEN-HAT"];

function App() {
  const [kick] = useState(
    new Howl({
      src: ["/sounds/kick.wav"],
    })
  );
  const [hihat] = useState(
    new Howl({
      src: ["/sounds/hihat.wav"],
    })
  );
  const [openhat] = useState(
    new Howl({
      src: ["/sounds/openhat.wav"],
    })
  );
  const [snare] = useState(
    new Howl({
      src: ["/sounds/snare.wav"],
    })
  );
  const [streamDest] = useState(Howler.ctx.createMediaStreamDestination());
  const [mediaRecorder] = useState(
    new MediaRecorder(streamDest.stream, { mimeType: "audio/webm" })
  );
  const [recordingId, setRecordingId] = useState<null | string>(null);

  const [tracks, setTracks] = useState<Track[]>(initTracks);

  useEffect(() => {
    Howler.masterGain.connect(streamDest);
  }, []);

  useEffect(() => {
    mediaRecorder.addEventListener("dataavailable", onMediaData);
    return () =>
      mediaRecorder.removeEventListener("dataavailable", onMediaData);
  }, [onMediaData]);

  useEffect(() => {
    window.addEventListener("keypress", onKeyPress, true);
    return () => window.removeEventListener("keypress", onKeyPress, true);
  }, [onKeyPress]);

  function onPlay(id: string) {
    setTracks((current) =>
      current.map((t) => {
        if (t.id === id) {
          return { ...t, playing: true };
        } else return t;
      })
    );
  }

  function onStop(id: string) {
    setTracks((current) =>
      current.map((t) => {
        if (t.id === id) {
          return { ...t, playing: false };
        } else return t;
      })
    );
  }

  function onCheck(id: string) {
    setTracks((current) =>
      current.map((t) => {
        if (t.id === id) {
          return { ...t, checked: !t.checked };
        } else return t;
      })
    );
  }

  function onMediaData(event: any) {
    if (recordingId) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target && e.target.result) {
          const options = {
            src: e.target.result as string,
            format: ["webm"],
          };
          setTracks((current) =>
            current.map((t) => {
              if (t.id === recordingId) {
                const newHowl = new Howl(options);
                newHowl.on("stop", () => onStop(t.id));
                newHowl.on("end", () => onStop(t.id));
                newHowl.on("play", () => onPlay(t.id));
                return { ...t, howl: newHowl };
              } else return t;
            })
          );
          setRecordingId(null);
        }
      };
      fileReader.readAsDataURL(event.data); // sends url to onLoad
    }
  }

  function onKeyPress(e: any) {
    const { key } = e;
    switch (key) {
      case "1":
        kick.play();
        return;
      case "2":
        hihat.play();
        return;
      case "3":
        snare.play();
        return;
      case "4":
        openhat.play();
        return;
      default:
        return;
    }
  }

  function onPlaySelected() {
    tracks.forEach((t) => {
      if (t.howl && t.checked) t.howl.play();
    });
  }

  const isChecked = !!tracks.find((t) => t.checked === true);

  return (
    <Space
      direction="vertical"
      align="center"
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "whitesmoke",
        paddingTop: 15,
      }}
    >
      <Space>
        <h1>DrumKit</h1>
      </Space>
      <Space>
        {data.map((item, index) => (
          <div
            key={item}
            style={{
              boxShadow: "2px 5px 10px gray",
              borderRadius: 10,
              padding: 15,
              margin: 10,
            }}
          >
            {`${index + 1} ---> ${item}`}
          </div>
        ))}
      </Space>
      {recordingId && (
        <Card
          style={{
            margin: 15,
            boxShadow: "2px 5px 10px gray",
            borderRadius: 10,
          }}
        >
          <Space>
            <h2>Nagrywanie...</h2>
            <Button
              shape="circle"
              icon={<AudioMutedOutlined />}
              size="large"
              danger
              type="primary"
              onClick={() => {
                mediaRecorder.stop();
              }}
            />
          </Space>
        </Card>
      )}
      {isChecked && (
        <Card
          style={{
            margin: 15,
            boxShadow: "2px 5px 10px gray",
            borderRadius: 10,
          }}
        >
          <Space>
            <h2>Odtwórz zaznaczone</h2>
            <Button
              shape="circle"
              icon={<CaretRightOutlined />}
              size="large"
              type="primary"
              onClick={onPlaySelected}
            />
          </Space>
        </Card>
      )}
      <Space>
        {tracks.map((track, i) => {
          return (
            <Card
              key={i}
              extra={
                <Checkbox
                  checked={track.checked}
                  onChange={() => onCheck(track.id)}
                />
              }
              title={`Kanał ${track.id}`}
              style={{
                width: 200,
                margin: 15,
                boxShadow: "2px 5px 10px gray",
                borderRadius: 10,
              }}
            >
              <Space
                style={{
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <Button
                  shape="circle"
                  icon={
                    track.playing ? <PauseOutlined /> : <CaretRightOutlined />
                  }
                  size="large"
                  type="primary"
                  disabled={!track.howl}
                  onClick={() => {
                    if (track.howl) track.howl.play();
                  }}
                />
                <Button
                  shape="circle"
                  icon={<AudioOutlined />}
                  size="large"
                  danger
                  type="primary"
                  disabled={!!recordingId || track.playing}
                  onClick={() => {
                    console.log("mediaRecorder state", mediaRecorder.state);
                    setRecordingId(track.id);
                    mediaRecorder.start();
                  }}
                />
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size="large"
                  onClick={() => {
                    setTracks((current) =>
                      current.map((t) => {
                        if (t.id === track.id) return { ...t, howl: null };
                        else return t;
                      })
                    );
                  }}
                />
              </Space>
            </Card>
          );
        })}
      </Space>
    </Space>
  );
}

export default App;
