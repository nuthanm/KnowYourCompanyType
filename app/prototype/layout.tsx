import type { Metadata } from "next";
import "../styles/prototype.css";

export const metadata: Metadata = {
  title: "Know Your IT Hub — Site Prototype",
  description: "Interactive prototype of the Know Your IT Hub company directory.",
};

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
