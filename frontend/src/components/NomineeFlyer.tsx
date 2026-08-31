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
  // Optional footer strip — omitted entirely (no empty bar) if not provided.
  // No phone number field by design.
  poweredBy?: string;
  sponsors?: string;
}

function Flourish({ children }: { children: React.ReactNode }) {
  return (
    <div className="flyer-flourish">
      <span className="flyer-diamond" />
      {children}
      <span className="flyer-diamond" />
    </div>
  );
}

// Fixed 1080x1350 canvas — FlyerCard scales it down visually for on-screen
// preview without touching the export resolution.
export const NomineeFlyer = forwardRef<HTMLDivElement, NomineeFlyerProps>(function NomineeFlyer(
  { user, nomineeCode, votingLink, ussdCode = "[USSD CODE]", votingSteps, poweredBy, sponsors },
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
            <div className="flyer-photo-inner">
              {imageUrl ? (
                <img className="flyer-photo" src={imageUrl} alt={fullName} />
              ) : (
                <div className="flyer-photo flyer-photo-placeholder">{user.firstName[0]}</div>
              )}
            </div>
            <div className="flyer-code-badge">
              <span className="flyer-code-label">Nominee Code</span>
              <span className="flyer-code-value">{code}</span>
            </div>
          </div>

          <div className="flyer-info">
            <p className="flyer-eyebrow">Vote</p>
            <div className="flyer-eyebrow-rule" />
            <h1 className="flyer-name">{fullName}</h1>
            {user.nickName ? <Flourish><span className="flyer-nickname">({user.nickName})</span></Flourish> : null}
            <p className="flyer-as">as</p>
            <Flourish><p className="flyer-category">{user.category}</p></Flourish>

            <div className="flyer-vote-banner">To Vote</div>
            <ol className="flyer-steps-panel">
              {steps.map((step, i) => (
                <li key={i}>
                  <span className="flyer-step-num">{i + 1}</span>
                  <span className="flyer-step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {(poweredBy || sponsors) && (
          <div className="flyer-footer-top">
            {poweredBy && (
              <div className="flyer-footer-item">
                <span className="flyer-footer-label">Powered By</span>
                <span className="flyer-footer-value">{poweredBy}</span>
              </div>
            )}
            {poweredBy && sponsors && <div className="flyer-footer-divider" />}
            {sponsors && (
              <div className="flyer-footer-item">
                <span className="flyer-footer-label">Sponsors</span>
                <span className="flyer-footer-value">{sponsors}</span>
              </div>
            )}
          </div>
        )}

        <div className="flyer-footer-bottom">
          <span>
            Vote Online: <strong>{link.replace(/^https?:\/\//, "")}</strong>
          </span>
        </div>
      </div>
    </div>
  );
});
