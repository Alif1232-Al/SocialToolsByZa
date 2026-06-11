"use client";
import { ReactNode } from "react";

type PremiumGateProps = { children: ReactNode; title?: string };

export default function PremiumGate({ children }: PremiumGateProps) {
  return <>{children}</>;
}
