import { ADMIN_WHATSAPP } from "../config/brand";
function openAdminWhatsApp(message: string) { const number = ADMIN_WHATSAPP[Math.floor(Math.random() * ADMIN_WHATSAPP.length)]; window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer"); }
export function openResetWhatsApp(name = "") { openAdminWhatsApp(`Hello, I am ${name || "an OD YES AWARDS participant"}. I would like help resetting my password.`); }
export function openPhotoChangeWhatsApp(name: string) { openAdminWhatsApp(`Hello, I am ${name}. I have reached my OD YES AWARDS profile photo change limit and would like help updating my flyer photo.`); }
