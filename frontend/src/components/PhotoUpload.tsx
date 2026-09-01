import { Camera, LockKeyhole, X } from "lucide-react";
import { useState } from "react";
import type { User } from "../types";

export function PhotoUpload({ user, pending, isAdmin, onPick, onLimitHelp, uploadProgress = 0 }: { user: Pick<User, "profileImage" | "profileChangeCount" | "firstName">; pending?: boolean; isAdmin?: boolean; onPick: (file: File) => void; onLimitHelp?: () => void; uploadProgress?: number }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const left = Math.max(0, 3 - user.profileChangeCount);
  const disabled = left === 0 || pending;
  const imageUrl = user.profileImage ? (user.profileImage.startsWith("http") ? user.profileImage : `https://yes-awards.onrender.com${user.profileImage}`) : "";

  const description = user.profileImage
    ? (isAdmin ? `${user.firstName}'s full photo is shown in the portal. Choose a clear, portrait-style image.` : "We show your full photo in the portal. Choose a clear, portrait-style image.")
    : (isAdmin ? `Set ${user.firstName}'s best profile photo — it will be used to generate their nominee flyer.` : "Set your best profile photo now — it will be used to generate your nominee flyer.");

  const uploadLabel = user.profileImage ? "Replace photo" : (isAdmin ? "Upload a photo" : "Upload your best photo");

  const warning = isAdmin
    ? `Replacing this photo will use 1 of ${user.firstName}'s ${left} remaining uploads.`
    : `Replacing this photo will use 1 of your ${left} remaining uploads.`;

  const progressValue = Math.min(Math.max(uploadProgress, 0), 100);

  return <section className="photo-card">
    <button type="button" className="photo-frame" disabled={!imageUrl} aria-label={imageUrl ? `View ${user.firstName}'s profile image full screen` : "No profile image available"} onClick={() => imageUrl && setLightboxOpen(true)}>
      {imageUrl ? <img src={imageUrl} alt={`${user.firstName}'s profile`}/> : <span>{user.firstName[0]}</span>}
    </button>
    <div>
      <p className="eyebrow">FLYER PROFILE PHOTO</p>
      <h3>{user.profileChangeCount} of 3 uploads used</h3>
      <p className="muted">{description}</p>
      {pending ? <div className="upload-progress-wrap"><div className="upload-progress-bar" aria-label="Upload progress"><span style={{ width: `${progressValue}%` }}/></div><small>{progressValue > 0 ? `Uploading ${progressValue}%` : "Uploading..."}</small></div> : (disabled ? <button className="button muted-button" onClick={onLimitHelp}><LockKeyhole size={16}/> Contact an admin to change it</button> : <label className="button mini"><Camera size={16}/>{uploadLabel}<input hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}/></label>)}
      {user.profileImage && left > 0 && <p className="warning">{warning}</p>}
    </div>
    {lightboxOpen && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={`${user.firstName}'s profile image`} onClick={() => setLightboxOpen(false)}>
      <button type="button" className="photo-lightbox-close" aria-label="Close full-screen image" onClick={() => setLightboxOpen(false)}><X size={22}/></button>
      <img src={imageUrl} alt={`${user.firstName}'s profile full screen`} onClick={event => event.stopPropagation()}/>
    </div>}
  </section>;
}