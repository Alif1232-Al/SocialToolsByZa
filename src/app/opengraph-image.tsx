import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SocialToolsByZa - Alat Tempur Mahasiswa IT & Content Creator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TOOLS = [
  { icon: "⬇️", name: "TikTok Downloader" },
  { icon: "🖼️", name: "Remove Background" },
  { icon: "📄", name: "PDF to Word" },
  { icon: "🔍", name: "OCR Picture to Text" },
  { icon: "📸", name: "Picture to PDF" },
  { icon: "🕵️", name: "Dorking OSINT" },
  { icon: "📋", name: "JSON Formatter" },
  { icon: "💬", name: "Quote Generator" },
  { icon: "💰", name: "Barber Kalkulator" },
  { icon: "🎨", name: "Photobox Studio" },
  { icon: "📚", name: "Jurnal Finder" },
  { icon: "✍️", name: "Markdown Preview" },
  { icon: "🔗", name: "Linktree Generator" },
];

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#FACC15",
          border: "10px solid #000",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Arial", sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Corner decoration - top right */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 160,
            height: 160,
            background: "#EC4899",
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(15deg)",
            fontSize: 56,
          }}
        >
          ⚡
        </div>

        {/* Corner decoration - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 120,
            height: 120,
            background: "#06B6D4",
            borderRadius: 30,
            transform: "rotate(-10deg)",
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🚀
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                background: "#000",
                color: "#FACC15",
                fontSize: 76,
                fontWeight: 900,
                textTransform: "uppercase",
                fontStyle: "italic",
                padding: "6px 24px",
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              SOCIAL TOOLS
            </span>
            <span
              style={{
                background: "#000",
                color: "#fff",
                fontSize: 76,
                fontWeight: 900,
                textTransform: "uppercase",
                fontStyle: "italic",
                padding: "6px 24px",
                letterSpacing: 1,
                lineHeight: 1,
                marginTop: 4,
              }}
            >
              BY ZA!!
            </span>
          </div>

          <p
            style={{
              fontSize: 18,
              color: "#000",
              fontWeight: 700,
              marginTop: 12,
              marginBottom: 0,
              opacity: 0.7,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Alat Tempur Mahasiswa IT &amp; Content Creator
          </p>
        </div>

        {/* Tools grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 10,
            padding: "24px 60px 0",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#000",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              <span style={{ fontSize: 18 }}>{tool.icon}</span>
              <span>{tool.name}</span>
            </div>
          ))}
        </div>

        {/* Bottom badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 24,
          }}
        >
          <span
            style={{
              background: "#EC4899",
              color: "#fff",
              padding: "6px 24px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ⚡ 100% GRATIS
          </span>
          <span
            style={{
              background: "#000",
              color: "#fff",
              padding: "6px 24px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            🚀 PROSES CEPET
          </span>
          <span
            style={{
              background: "#06B6D4",
              color: "#fff",
              padding: "6px 24px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            🎨 KEREN ABIS
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
