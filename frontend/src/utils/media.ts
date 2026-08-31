import type { User } from "../types";

// Same host PhotoUpload.tsx uses for relative profile-image paths returned by the API.
// Pulled out here so it isn't duplicated between PhotoUpload and the flyer generator.
const IMAGE_HOST = "https://yes-awards.onrender.com";

export function resolveProfileImage(user: Pick<User, "profileImage">): string {
  if (!user.profileImage) return "";
  return user.profileImage.startsWith("http") ? user.profileImage : `${IMAGE_HOST}${user.profileImage}`;
}

// PhotoUpload.tsx renders this same photo elsewhere on the dashboard page
// WITHOUT crossOrigin set, while the flyer needs crossOrigin="anonymous" to
// export it via canvas. Safari/WebKit has a known bug where it can reuse a
// non-CORS cache entry for a same-URL CORS request, silently tainting the
// image on export — Chrome keys its cache by CORS mode and doesn't have
// this problem, which is why it can work on desktop and break on iPhone for
// the exact same photo. Appending a distinct query param forces Safari to
// treat this as a separate resource/cache entry, sidestepping the bug
// without touching PhotoUpload.tsx.
export function resolveFlyerPhoto(user: Pick<User, "profileImage">): string {
  const url = resolveProfileImage(user);
  if (!url) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}flyerExport=1`;
}

// Once nomineeCode exists on the User table, this just returns it. Until
// then it derives a placeholder from the id so the flyer isn't blank.
// Delete the fallback branch once the backend field is live everywhere.
export function nomineeCodeFor(user: Pick<User, "id"> & { nomineeCode?: string | null }): string {
  return user.nomineeCode || `OY-${user.id.slice(-6).toUpperCase()}`;
}

// Voting happens on an external system, not this app — there is no local
// route to build. This is just a placeholder string so the flyer's CTA
// isn't blank; pass a real `votingLink` prop into FlyerCard/NomineeFlyer
// once you have the external voting URL for each nominee.
export const PLACEHOLDER_VOTING_LINK = "vote.odyesawards.com";
