import { forwardRef } from "react";
import type { User } from "../types";
import { resolveProfileImage, nomineeCodeFor, PLACEHOLDER_VOTING_LINK } from "../utils/media";

export interface NomineeFlyerProps {
  user: Pick<User, "id" | "firstName" | "lastName" | "nickName" | "category" | "profileImage"> & {
    nomineeCode?: string | null;
  };
  nomineeCode?: string;
  votingLink?: string;
  // The USSD short code for the external voting system. Swap the default
  // placeholder for the real one once it exists.
  ussdCode?: string;
  // Override the whole step list if the external voting system's real flow
  // ends up different from the 6-step dial/select/enter/confirm/pay pattern.
  votingSteps?: string[];
}

// Fixed 1080x1260 canvas — tall enough to fit the full 6-step voting
// instructions without crowding. FlyerCard scales it down visually for
// on-screen preview without touching the export resolution.
export const NomineeFlyer = forwardRef<HTMLDivElement, NomineeFlyerProps>(function NomineeFlyer(
  { user, nomineeCode, votingLink, ussdCode = "[USSD CODE]", votingSteps },
  ref
) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const imageUrl = resolveProfileImage(user);
  const code = nomineeCode ?? nomineeCodeFor(user);
  const link = votingLink ?? PLACEHOLDER_VOTING_LINK;

  const steps = votingSteps ?? [
    `Dial ${ussdCode}`,
    "Select vote",
    `Enter ${code}`,
    "Enter number of votes",
    "Confirm amount and details",
    "Enter pin and make payment",
  ];

  return (
    <div className="flyer" ref={ref}>
      <img className="flyer-bg" src={`${import.meta.env.BASE_URL}media/bg.webp`} alt="" />
      <div className="flyer-scrim" />

      <div className="flyer-content">
        <img className="flyer-logo" src={`${import.meta.env.BASE_URL}media/logo.webp`} alt="OD YES AWARDS" />

        <div className="flyer-body">
          <div className="flyer-photo-frame">
            {imageUrl ? (
              <img className="flyer-photo" src={imageUrl} alt={fullName} />
            ) : (
              <div className="flyer-photo flyer-photo-placeholder">{user.firstName[0]}</div>
            )}
          </div>

          <div className="flyer-info">
            <p className="flyer-eyebrow">VOTE</p>
            <h1 className="flyer-name">{fullName}</h1>
            {user.nickName ? <p className="flyer-nickname">({user.nickName})</p> : null}
            <p className="flyer-as">as</p>
            <p className="flyer-category">{user.category}</p>

            <div className="flyer-divider" />

            <p className="flyer-steps-title">TO VOTE</p>
            <ol className="flyer-steps">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flyer-footer">
          <div className="flyer-footer-item">
            <span className="flyer-footer-label">Nominee Code</span>
            <span className="flyer-footer-value">{code}</span>
          </div>
          <div className="flyer-footer-divider" />
          <div className="flyer-footer-item">
            <span className="flyer-footer-label">Vote Online</span>
            <span className="flyer-footer-value">{link.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
