import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, ExternalLink, Share2 } from "lucide-react";
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
  contactNumbers,
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
  contactNumbers?: [string, string];
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

  // pixelRatio 3 on a 1080x1300 canvas exports at ~3240x3900 — sharp enough
  // for print/large-screen sharing, not just feed-sized viewing.
  const renderBlob = async (): Promise<Blob> => {
    if (!flyerRef.current) throw new Error("Flyer not ready yet.");
    const dataUrl = await toPng(flyerRef.current, { pixelRatio: 3, cacheBust: true });
    const res = await fetch(dataUrl);
    return res.blob();
  };

  // Long base64 data: URLs are what actually break on iOS Safari — very
  // long ones can get silently truncated when assigned to an <a href> and
  // clicked, which shows up as a corrupted/partial image on download while
  // Share (which hands over a real File, no giant URL involved) works fine.
  // Going through a Blob + short-lived object URL avoids that entirely.
  const triggerDownload = (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoke after a short delay rather than immediately — some mobile
    // browsers process the download/save asynchronously and revoking too
    // early can cut that off.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
  };

  const download = async () => {
    setStatus("working");
    setError("");
    try {
      triggerDownload(await renderBlob());
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
      const blob = await renderBlob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "OD YES AWARDS — Nominee Flyer" });
      } else {
        triggerDownload(blob);
      }
      setStatus("idle");
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") { setStatus("idle"); return; }
      setError(e instanceof Error ? e.message : "Unable to share the flyer.");
      setStatus("error");
    }
  };

  // Fallback for browsers (mainly iOS Safari) where the download attribute
  // doesn't reliably trigger a save: open the full-resolution image in a
  // new tab so the user can long-press → Save Image / Add to Photos, which
  // always works regardless of download-attribute support.
  // const openFullImage = async () => {
  //   setStatus("working");
  //   setError("");
  //   try {
  //     const blob = await renderBlob();
  //     const objectUrl = URL.createObjectURL(blob);
  //     const win = window.open(objectUrl, "_blank", "noopener,noreferrer");
  //     if (!win) throw new Error("Your browser blocked the new tab — allow pop-ups and try again.");
  //     setStatus("idle");
  //     setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  //   } catch (e) {
  //     setError(e instanceof Error ? e.message : "Unable to open the flyer.");
  //     setStatus("error");
  //   }
  // };

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
            contactNumbers={contactNumbers}
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
        {/* <button className="button mini" disabled={status === "working"} onClick={() => void openFullImage()}>
          <ExternalLink size={16} /> Open full image
        </button> */}
      </div>
      {!canNativeShare && (
        <p className="flyer-hint">
          If "Download flyer" doesn't save on your device, tap "Open full image" instead, then press and hold the
          image to save it.
        </p>
      )}
    </div>
  );
}
