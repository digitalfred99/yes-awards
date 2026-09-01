import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, ExternalLink, Share2 } from "lucide-react";
import type { User } from "../types";
import { NomineeFlyer } from "./NomineeFlyer";
import { resolveFlyerPhoto } from "../utils/media";

const FLYER_WIDTH = 1080;
const FLYER_HEIGHT = 1300;

// Waits for an image to be fully loaded AND decoded before resolving.
// html-to-image can start rasterizing before a cross-origin image (which
// needs its own network round-trip) has actually finished loading — that's
// the race behind "works on the 2nd/3rd try, not the 1st": later attempts
// hit the browser's cache and load fast enough to win the race by luck.
// Explicitly awaiting every image first removes the race entirely.
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) { resolve(); return; }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.decode) {
        img.decode().then(() => resolve(), () => resolve());
      } else {
        resolve();
      }
    };
    // Don't let one failed asset block the whole export — toPng will just
    // render without it, same as before this change.
    img.onerror = () => resolve();
    img.src = src;
  });
}

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
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const resize = () => setScale(Math.min(1, el.clientWidth / FLYER_WIDTH));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isGenerated]);

  const fileName = `od-yes-${user.firstName}-${user.lastName}-flyer.png`.toLowerCase().replace(/\s+/g, "-");

  const renderBlob = async (): Promise<Blob> => {
    if (!flyerRef.current) throw new Error("Flyer not ready yet.");

    await Promise.all([
      preloadImage(resolveFlyerPhoto(user)),
      preloadImage(`${import.meta.env.BASE_URL}media/logo.webp`),
      preloadImage(`${import.meta.env.BASE_URL}media/bg.webp`),
    ]);

    const dataUrl = await toPng(flyerRef.current, { pixelRatio: 3, cacheBust: true });
    const res = await fetch(dataUrl);
    return res.blob();
  };

  const triggerDownload = (blob: Blob) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
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

  const generateFlyer = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError("");
    setStatus("working");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
      await renderBlob();
      setIsGenerated(true);
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate the flyer.");
      setStatus("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="panel flyer-card">
      <div className="panel-title">
        <div>
          <p className="eyebrow">SHAREABLE</p>
          <h2>{isGenerated ? "Your nominee flyer" : "Nominee flyer"}</h2>
        </div>
      </div>

      {error && <div className="notice" role="alert">{error}</div>}

      {!isGenerated ? (
        <div className="flyer-empty-state">
          <button type="button" className="button" disabled={isGenerating} onClick={() => void generateFlyer()}>
            {isGenerating ? "Generating..." : "Generate Nominee Flyer"}
          </button>
        </div>
      ) : (
        <>
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
          </div>
          {!canNativeShare && (
            <p className="flyer-hint">
              If "Download flyer" doesn't save on your device, tap "Open full image" instead, then press and hold the
              image to save it.
            </p>
          )}
        </>
      )}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: FLYER_WIDTH,
          height: FLYER_HEIGHT,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div className="flyer-scale" style={{ width: FLYER_WIDTH, height: FLYER_HEIGHT }}>
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
    </div>
  );
}
