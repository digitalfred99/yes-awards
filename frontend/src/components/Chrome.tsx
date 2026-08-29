import { Menu, X, Trophy, LogOut } from "lucide-react";
import { useState } from "react";
import { BRAND } from "../config/brand";
import { session } from "../utils/session";

//Trophy logo
// export function Logo() { return <a className="logo" href="#/"><span><Trophy size={17}/></span>{BRAND.name}</a>; }
//Custom logo
export function Logo() { return <a className="logo" href="#/"><img src={ `${import.meta.env.BASE_URL}media/logo.png` } alt="OD YES AWARDS" /></a>; }
export function Header() { const [open, setOpen] = useState(false); const logged = session.get(); return <header><Logo/><button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button><nav className={open ? "open" : ""}><a href="#/categories">Categories</a>{logged ? <a href={logged.user.role === "NOMINEE" ? "#/dashboard" : "#/admin"}>Dashboard</a> : <><a href="#/login">Sign in</a><a className="button mini" href="#/register">Become a nominee</a></>}</nav></header>; }
export function Footer() { return <footer><Logo/><p>© {new Date().getFullYear()} OD YES AWARDS. A celebration of excellence.</p></footer>; }
export function DashboardHeader({ title }: { title: string }) { return <div className="dash-head"><div><p className="eyebrow">OD YES AWARDS / PORTAL</p><h1>{title}</h1></div><button className="text-btn" onClick={() => { session.clear(); location.hash = "/"; }}><LogOut size={16}/> Sign out</button></div>; }
