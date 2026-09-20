import { AlertCircle, LoaderCircle, SearchX } from "lucide-react";
export function Loading({ label = "Loading" }: { label?: string }) { return <div className="state"><LoaderCircle className="spin"/><p>{label}…</p></div>; }
export function ErrorState({ message, retry }: { message: string; retry?: () => void }) { return <div className="state"><AlertCircle/><p>{message}</p>{retry && <button className="button mini" onClick={retry}>Try again</button>}</div>; }
export function Empty({ label }: { label: string }) { return <div className="state"><SearchX/><p>{label}</p></div>; }
