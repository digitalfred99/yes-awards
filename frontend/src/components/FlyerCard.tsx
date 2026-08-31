import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
import type { User } from "../types";
import { NomineeFlyer } from "./NomineeFlyer";

const FLYER_WIDTH = 1080;
const FLYER_HEIGHT = 1300;

export function FlyerCard({
  user,
  nomineeCode,
  votingLink,
  ussdCode,
  votingSteps,
  poweredBy,
  sponsors,
}: {
  user: Pick<User, "id" | "firstName" | "lastName" | "nickName" | "category" | "profileImage"> & {
    nomineeCode?: string | null;
  };
  nomineeCode?: string;
  votingLink?: string;
  ussdCode?: string;
  votingSteps?: string[];
  poweredBy?: string;
  sponsors?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const resize = () => setScale(Math.min(1, el.clientWidth / FLYER_WIDTH));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fileName = `od-yes-${user.firstName}-${user.lastName}-flyer.png`.toLowerCase().replace(/\s+/g, "-");

  const renderPng = async () => {
    if (!flyerRef.current) throw new Error("Flyer not ready yet.");
    return toPng(flyerRef.current, { pixelRatio: 2, cacheBust: true });
  };

  const download = async () => {
    setStatus("working");
    setError("");
    try {
      const dataUrl = await renderPng();
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate the flyer.");
      setStatus("error");
    }
  };

  const share = async () => {
    setStatus("working");
    setError("");
    try {
      const dataUrl = await renderPng();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "OD YES AWARDS — Nominee Flyer" });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
      setStatus("idle");
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") { setStatus("idle"); return; }
      setError(e instanceof Error ? e.message : "Unable to share the flyer.");
      setStatus("error");
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="panel flyer-card">
      <div className="panel-title">
        <div>
          <p className="eyebrow">SHAREABLE</p>
          <h2>Your nominee flyer</h2>
        </div>
      </div>

      {error && <div className="notice" role="alert">{error}</div>}

      <div className="flyer-stage" ref={stageRef} style={{ height: FLYER_HEIGHT * scale }}>
        <div className="flyer-scale" style={{ transform: `scale(${scale})`, width: FLYER_WIDTH, height: FLYER_HEIGHT }}>
          <NomineeFlyer
            ref={flyerRef}
            user={user}
            nomineeCode={nomineeCode}
            votingLink={votingLink}
            ussdCode={ussdCode}
            votingSteps={votingSteps}
            poweredBy={poweredBy}
            sponsors={sponsors}
          />
        </div>
      </div>

      <div className="flyer-actions">
        <button className="button" disabled={status === "working"} onClick={() => void download()}>
          <Download size={16} /> {status === "working" ? "Preparing…" : "Download flyer"}
        </button>
        {canNativeShare && (
          <button className="button mini" disabled={status === "working"} onClick={() => void share()}>
            <Share2 size={16} /> Share
          </button>
        )}
      </div>
    </div>
  );
}
