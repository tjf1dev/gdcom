"use client";
import { version } from "@/package.json";
import { useRef, useState } from "react";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState(" ");
  const levelIDInputRef = useRef<HTMLInputElement | null>(null);
  const levelInputRef = useRef<HTMLInputElement | null>(null);

  const handleStart = () => {
    setStarted(true);
  };

  const handleFileUpload = async () => {
    const file = levelInputRef.current?.files?.[0];
    if (!file) return;

    setStatus("reading file...");

    try {
      const text = await file.text();
      localStorage.setItem("level", text);
      setStatus(`${file.name} loaded!`);
    } catch {
      setStatus("failed to read file");
    }
  };
  const handleLevelDownload = async () => {
    const value = levelIDInputRef?.current?.value;
    if (!value) return;

    setStatus("downloading level...");
    const level = await fetch(`/api/levels/${value}`);
    if (level.status == 404) {
      setStatus(`level ${value} does not exist.`);
      return;
    }
    if (!level.ok) {
      setStatus(`an error occured`);
      return;
    }
    const data = await level.json();
    setStatus(`downloading ${data.name} by ${data.author_name}...`);

    const levelDataReq = await fetch(`/api/levels/${value}/data`);
    if (!levelDataReq.ok) {
      setStatus(`an error occured`);
      return;
    }
    const levelData = await levelDataReq.text();
    localStorage.setItem("level", levelData);

    setStatus(`${data.name} by ${data.author_name} downloaded!`);
  };
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center font-sans bg-(--background-0) text-(--foreground-0)">
      {started && (
        <iframe
          ref={iframeRef}
          src="/game/game.html"
          className="w-full h-full border-0 absolute top-0 md:top-1/2 left-1/2 -translate-1/2"
        />
      )}
      {!started && (
        <>
          <div className="bg-(--background-2) p-4 flex flex-col items-start pb-1 rounded-md border border-(--border)">
            <h1 className="text-2xl">geometrydash.com custom level injector</h1>
            <div className="flex flex-col sm:flex-row gap-1 w-full items-center">
              <input
                ref={levelIDInputRef}
                className="px-6 py-3 rounded-md bg-(--background-2) border border-(--border) duration-200 w-full hover:bg-(--background-3) flex-4/5"
                placeholder="Level ID"
                type="number"
              />
              <button
                onClick={handleLevelDownload}
                className="px-6 py-3 rounded-md bg-(--background-2) border border-(--border) duration-200 w-full hover:bg-(--background-3) flex-1/5"
              >
                Download
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-1 items-center w-full mt-1">
              <p className="w-full sm:flex-1/2">
                ...or upload a level file (advanced)
              </p>
              <input
                type="file"
                ref={levelInputRef}
                onChange={handleFileUpload}
                className="px-3 w-full sm:flex-1/2 py-1 rounded-md bg-(--background-2) border border-(--border) duration-200 hover:bg-(--background-3"
              />
            </div>
            <pre className="mt-2 self-center opacity-50">{status}</pre>
            <hr className="w-full text-(--foreground)/30 mb-4" />
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-md bg-(--background-2) border border-(--border) duration-200 w-full hover:bg-(--background-3)"
            >
              Start
            </button>
            <span className="font-mono text-(--foreground-0)/35 mt-3 leading-4 text-sm">
              v{version} | made by{" "}
              <a className="underline" href="https://tjf1.dev">
                tjf1
              </a>
              .{" "}
              <a
                className="underline"
                target="_blank"
                href="https://github.com/tjf1dev/gdcom"
              >
                source code
              </a>
            </span>
            <span className="font-mono text-(--foreground-0)/35 leading-4 text-sm">
              geometry dash belongs to RobTop Games
            </span>
            <span className="font-mono text-(--foreground-0)/35 leading-4 text-sm">
              most levels won&apos;t actually work, this is just a silly thing i
              made
            </span>
          </div>
        </>
      )}
    </div>
  );
}
