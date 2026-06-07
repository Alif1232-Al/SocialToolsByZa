"use client";
import { ReactNode } from "react";

interface ComicPanelProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;
  badge?: string;
  badgePosition?: "left" | "right";
  badgeColor?: string;
}

export default function ComicPanel({
  children,
  className = "",
  bgColor = "bg-white",
  badge,
  badgePosition = "right",
  badgeColor = "bg-pink-500 text-white",
}: ComicPanelProps) {
  const badgePosClass = badgePosition === "right" ? "-top-4 -right-4 rotate-12" : "-top-4 -left-4 -rotate-6";

  return (
    <div className={`relative comic-panel ${bgColor} ${className}`}>
      {badge && (
        <div className={`comic-badge ${badgePosClass} ${badgeColor}`}>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
}
