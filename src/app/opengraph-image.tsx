import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SocialToolsByZa!! - Alat Tempur Mahasiswa IT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#FACC15",
          border: "12px solid #000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Impact", "Arial Black", sans-serif',
          padding: 60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            background: "#EC4899",
            borderRadius: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(15deg)",
            fontSize: 64,
          }}
        >
          ⚡
        </div>

        <div
          style={{
            background: "#EC4899",
            color: "#fff",
            padding: "10px 28px",
            borderRadius: 10,
            fontSize: 22,
            fontFamily: '"Arial", sans-serif',
            fontWeight: 700,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          🔥 12+ Alat Sakti — Gratis!
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              background: "#000",
              color: "#FACC15",
              fontSize: 88,
              fontWeight: 900,
              textTransform: "uppercase",
              fontStyle: "italic",
              padding: "8px 24px",
              letterSpacing: 2,
            }}
          >
            SOCIAL TOOLS
          </span>
          <span
            style={{
              background: "#000",
              color: "#fff",
              fontSize: 88,
              fontWeight: 900,
              textTransform: "uppercase",
              fontStyle: "italic",
              padding: "8px 24px",
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            BY ZA!!
          </span>
        </div>

        <p
          style={{
            fontSize: 24,
            color: "#000",
            textAlign: "center",
            fontFamily: '"Arial", sans-serif',
            fontWeight: 600,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          TikTok Downloader · PDF to Word · Remove BG · OCR · Jurnal Finder · Dorking · Markdown · Linktree Generator
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 12,
          }}
        >
          {[
            { text: "⚡ TIKTOK DL", bg: "#EC4899" },
            { text: "📄 PDF→WORD", bg: "#06B6D4" },
            { text: "🎨 REMOVE BG", bg: "#000" },
            { text: "🔍 DORKING", bg: "#8B5CF6" },
          ].map((badge) => (
            <span
              key={badge.text}
              style={{
                background: badge.bg,
                color: "#fff",
                padding: "8px 20px",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 700,
                fontFamily: '"Arial", sans-serif',
              }}
            >
              {badge.text}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
